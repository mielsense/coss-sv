import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Tooltip from "./index.js";
import TooltipSsrFixture from "./tooltip.ssr-fixture.svelte";
import AttachmentFixture from "./tooltip-attachment.browser-fixture.svelte";

describe("Tooltip SSR contract", () => {
  test("keeps attached safe transit local and off Shards private modules", () => {
    const attachment = readFileSync(
      resolve(import.meta.dirname, "create-trigger-attachment.svelte.ts"),
      "utf8",
    );
    const safePolygon = readFileSync(resolve(import.meta.dirname, "safe-polygon.ts"), "utf8");

    expect(attachment).toContain('from "./safe-polygon.js"');
    expect(`${attachment}\n${safePolygon}`).not.toMatch(
      /@shardsui|shardsui\/src|\$lib\/internal|safe-polygon\.svelte/,
    );
  });

  test("exports provider, compound parts, and detached handles", () => {
    expect(Tooltip.Provider).toBeDefined();
    expect(Tooltip.Root).toBeDefined();
    expect(Tooltip.Trigger).toBeDefined();
    expect(Tooltip.Popup).toBeDefined();
    expect(Tooltip.Handle).toBeDefined();
    expect(Tooltip.createTriggerAttachment).toBeTypeOf("function");
    expect(Tooltip.TooltipCreateHandle()).toBeInstanceOf(Tooltip.Handle);

    const { body } = render(TooltipSsrFixture);
    expect(body).toContain('data-slot="tooltip-trigger"');
    expect(body).toContain("Hover me");
  });

  test("keeps caller-supplied attachment relationships in the server HTML", () => {
    const { body } = render(AttachmentFixture);
    expect(body).toContain('data-testid="attached-focus"');
    expect(body).toMatch(/aria-describedby="[^"]+-focus-popup"/);
    expect(body).toMatch(/id="[^"]+-focus"/);
    expect(body).not.toContain('data-slot="tooltip-trigger"');
  });
});
