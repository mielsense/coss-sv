import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";

async function readParityFixture(name: string): Promise<string> {
  return readFile(new URL(`./${name}.svelte`, import.meta.url), "utf8");
}

describe("C12 parity fixtures", () => {
  test("keeps the Toolbar Select item-alignment and slot contract", async () => {
    const toolbar = await readParityFixture("toolbar");

    expect(toolbar).toContain("const alignItemWithTrigger = true;");
    expect(toolbar).toContain("bind:open={fontOpen}");
    expect(toolbar).toContain('data-slot="select-item"');
    expect(toolbar).toContain("sideOffset={fontSideOffset}");
  });

  test("uses the official Hugeicons mappings in the Menu icon particle", async () => {
    const menu = await readParityFixture("menu");

    expect(menu).toContain('name="play"');
    expect(menu).toContain('name="pause"');
    expect(menu).toContain('name="previous"');
    expect(menu).toContain('name="next"');
    expect(menu).toContain('name="trash"');
    expect(menu).not.toMatch(/lucide-|<svg|<path/i);
  });

  test("uses the official Hugeicons mappings in the Context Menu icon particle", async () => {
    const contextMenu = await readParityFixture("context-menu");
    const tooltip = await readParityFixture("tooltip");

    expect(contextMenu).toContain('name="pencil"');
    expect(contextMenu).toContain('name="copy"');
    expect(contextMenu).toContain('name="share"');
    expect(contextMenu).not.toContain('name="share-2"');
    expect(contextMenu).toContain('name="trash"');
    expect(contextMenu).not.toMatch(/lucide-|<svg|<path/i);
    expect(tooltip).toContain('name="share-2"');
    expect(tooltip).not.toContain('name="share"');
  });
});
