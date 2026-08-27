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

  test("uses the exact current Lucide markup in the Menu icon particle", async () => {
    const menu = await readParityFixture("menu");

    expect(menu).toContain('class="lucide lucide-play"');
    expect(menu).toContain(
      'd="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"',
    );
    expect(menu).toContain('<rect x="14" y="3" width="5" height="18" rx="1" />');
    expect(menu).toContain('<rect x="5" y="3" width="5" height="18" rx="1" />');
    expect(menu).toContain('class="lucide lucide-skip-back"');
    expect(menu).toContain(
      'd="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"',
    );
    expect(menu).toContain('d="M3 20V4"');
    expect(menu).toContain('class="lucide lucide-skip-forward"');
    expect(menu).toContain('d="M21 4v16"');
    expect(menu).toContain(
      'd="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"',
    );
    expect(menu).toContain('class="lucide lucide-trash"');
    expect(menu).toContain('d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"');
    expect(menu).toContain('d="M3 6h18"');
    expect(menu).toContain('d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"');
  });

  test("uses the exact current Lucide markup in the Context Menu icon particle", async () => {
    const contextMenu = await readParityFixture("context-menu");

    expect(contextMenu).toContain('class="lucide lucide-pencil"');
    expect(contextMenu).toContain(
      'd="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"',
    );
    expect(contextMenu).toContain('d="m15 5 4 4"');
    expect(contextMenu).toContain('class="lucide lucide-copy"');
    expect(contextMenu).toContain('<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />');
    expect(contextMenu).toContain('d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"');
    expect(contextMenu).toContain('class="lucide lucide-share"');
    expect(contextMenu).toContain('d="M12 2v13"');
    expect(contextMenu).toContain('d="m16 6-4-4-4 4"');
    expect(contextMenu).toContain('d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"');
    expect(contextMenu).toContain('class="lucide lucide-trash"');
    expect(contextMenu).toContain('d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"');
    expect(contextMenu).toContain('d="M3 6h18"');
    expect(contextMenu).toContain('d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"');
    expect(contextMenu).not.toContain('d="M10 11v6"');
    expect(contextMenu).not.toContain('d="M14 11v6"');
  });
});
