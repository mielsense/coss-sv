import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { highlightSource } from "../../src/lib/code/highlight.js";
import CodeSource from "../../src/lib/content/components/CodeSource.svelte";
import { highlightRegistryParticleSource } from "../../src/lib/content/particle-source.js";
import { loadRegistryComponentSource } from "../../src/lib/server/registry-component-source.js";
import { highlightCode } from "../../src/lib/site/highlight.js";

describe("source display trust boundaries", () => {
  const payloads = [
    '<svg onload="globalThis.sourceInjection = true"><script>alert(1)</script></svg>',
    '</code></pre><img src=x onerror="globalThis.sourceInjection = true">',
    '<?xml version="1.0"?><!DOCTYPE doc [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><doc>&xxe;</doc>',
    '<!DOCTYPE doc [<!ENTITY a "expansion"><!ENTITY b "&a;&a;&a;">]><doc>&b;</doc>',
    '{@html "<img src=x onerror=alert(1)>"}',
  ] as const;

  test.each(payloads)("renders hostile-looking source as text: %s", async (raw) => {
    const source = await highlightSource(raw, "svelte");
    const { body } = render(CodeSource, { props: { source } });

    expect(source.raw).toBe(raw);
    expect(
      source.lines
        .flat()
        .map(([text]) => text)
        .join(""),
    ).toBe(raw);
    expect(body).not.toMatch(/<(?:script|img|!DOCTYPE|\?xml)\b/i);
    expect(body).not.toContain("<svg onload=");
    expect(body).toContain("&lt;");
  });

  test("escapes SVG and script markup in compiled Markdown code fences", async () => {
    const markup = await highlightCode(payloads[0], "html");
    const expression = markup.match(/\{@html ("(?:\\.|[^"\\])*")\}/)?.[1];
    expect(expression).toBeDefined();
    if (!expression) throw new Error("Expected the compiled code fence HTML expression");
    const html = JSON.parse(expression) as string;
    expect(html).toMatch(/&(?:lt|#x3C);/);
    expect(html).not.toContain("<svg onload=");
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  test.each(["../button", "https://example.com", "button?url=x", "__proto__", "a\\b"])(
    "rejects registry lookup input before fetching: %s",
    async (name) => {
      const calls: string[] = [];
      await expect(
        loadRegistryComponentSource([name], async (requested) => {
          calls.push(requested);
          return {};
        }),
      ).rejects.toThrow("Invalid registry item name");
      expect(calls).toEqual([]);
    },
  );

  test("rejects remote dependencies instead of fetching an attacker URL", async () => {
    const calls: string[] = [];
    await expect(
      loadRegistryComponentSource(["button"], async (name) => {
        calls.push(name);
        return { registryDependencies: ["https://example.com/private.json"] };
      }),
    ).rejects.toThrow("Invalid registry item name");
    expect(calls).toEqual(["button"]);
  });

  test("limits particle source size before highlighting", async () => {
    await expect(
      highlightRegistryParticleSource("p-button-1", {
        files: [{ target: "p-button-1.svelte", content: "x".repeat(256 * 1024 + 1) }],
      }),
    ).rejects.toThrow("exceeds the source limit");
  });
});
