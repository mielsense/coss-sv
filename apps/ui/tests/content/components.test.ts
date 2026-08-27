import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { highlightSource } from "../../src/lib/code/highlight.js";
import ApiTable from "../../src/lib/content/components/ApiTable.svelte";
import CodeSource from "../../src/lib/content/components/CodeSource.svelte";
import InstallCommand from "../../src/lib/content/components/InstallCommand.svelte";
import PreviewCard from "../../src/lib/content/components/PreviewCard.svelte";

describe("documentation components", () => {
  test("renders only shadcn-svelte and pnpm installation methods", () => {
    const body = render(InstallCommand, {
      props: {
        pnpm: "pnpm add @shardsui/svelte",
        shadcnSvelte: "pnpm dlx shadcn-svelte@latest add https://example.com/r/accordion.json",
      },
    }).body;

    expect(body).toContain("shadcn-svelte");
    expect(body).toContain("pnpm");
    expect(body).not.toMatch(/>npm<|>yarn<|>bun</);
    expect(body).toContain('role="tablist"');
    expect(body).toContain('role="tabpanel"');
    expect(body).toMatch(/aria-controls="[^"]+-panel"/);
  });

  test("renders a deterministic particle preview URL and exact source tab", async () => {
    const source = await highlightSource(
      '<script lang="ts">\nlet count = $state(0);\n</script>',
      "svelte",
    );
    const body = render(PreviewCard, {
      props: { align: "start", name: "p-accordion-1", source, title: "Accordion" },
    }).body;

    expect(body).toContain('data-particle="p-accordion-1"');
    expect(body).toContain("/preview/p-accordion-1?theme=light&amp;width=desktop");
    expect(body).toContain(">Code<");
    expect(body).toContain("Copy to clipboard");
    expect(body.replace(/<[^>]*>/g, "")).toContain("$state(0)");
    expect(body).toContain('title="Accordion preview"');
    expect(body).toContain('role="tabpanel"');
  });

  test("renders highlighted token content as text rather than executable HTML", async () => {
    const source = await highlightSource('<img src=x onerror="globalThis.pwned=true">', "svelte");
    const body = render(CodeSource, { props: { source } }).body;

    expect(body).toContain("&lt;");
    expect(body).toContain(">img<");
    expect(body).not.toContain("<img");
  });

  test("renders typed Svelte API metadata", () => {
    const body = render(ApiTable, {
      props: {
        properties: [
          {
            defaultValue: "false",
            description: "Controls whether the item is expanded.",
            name: "open",
            required: false,
            type: "boolean",
          },
        ],
      },
    }).body;

    expect(body).toContain("open");
    expect(body).toContain("boolean");
    expect(body).toContain("Controls whether the item is expanded.");
  });
});
