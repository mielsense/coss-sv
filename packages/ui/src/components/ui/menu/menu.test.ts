import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Menu from "./index.js";
import MenuSsrFixture from "./menu.ssr-fixture.svelte";

describe("Menu SSR contract", () => {
  test("renders the complete COSS popup, item, selection, and submenu structure", () => {
    const { body } = render(MenuSsrFixture);

    expect(body).toContain('data-slot="menu-trigger"');
    expect(body).toMatch(/<button[^>]*type="button"[^>]*data-slot="menu-trigger"/);
    expect(body).toContain('data-slot="menu-positioner"');
    expect(body).toContain('data-slot="menu-popup"');
    expect(body).toContain("max-h-(--available-height) w-full overflow-y-auto p-1");
    expect(body).toContain("not-[class*='w-']:min-w-32");
    expect(body).toContain('data-slot="menu-group"');
    expect(body).toContain('data-slot="menu-label"');
    expect(body).toContain('data-inset="true"');
    expect(body).toContain('data-slot="menu-item"');
    expect(body).toContain('data-variant="destructive"');
    expect(body).toContain('data-slot="menu-shortcut"');
    expect(body).toContain('data-slot="menu-checkbox-item"');
    expect(body).toContain('d="M5.252 12.7 10.2 18.63 18.748 5.37"');
    expect(body).toContain('data-slot="menu-radio-item"');
    expect(body).toContain('data-slot="menu-sub-trigger"');
    expect(body).toContain('data-slot="menu-sub-content"');
    expect(body).toContain('id="ssr-menu-popup"');
    expect(body).toContain('id="ssr-menu-sub-popup"');

    const secondRender = render(MenuSsrFixture).body;
    expect(secondRender).toContain('id="ssr-menu-popup"');
    expect(secondRender).toContain('id="ssr-menu-sub-popup"');
  });

  test("exports the namespace, long aliases, dropdown aliases, handle, and primitive", () => {
    expect(Menu.Root).toBeTypeOf("function");
    expect(Menu.Menu).toBe(Menu.Root);
    expect(Menu.MenuPopup).toBe(Menu.Popup);
    expect(Menu.Content).toBe(Menu.Popup);
    expect(Menu.DropdownMenu).toBe(Menu.Root);
    expect(Menu.DropdownMenuContent).toBe(Menu.Popup);
    expect(Menu.SubmenuRoot).toBe(Menu.Sub);
    expect(Menu.MenuPrimitive).toBeTypeOf("object");
    expect(Menu.Handle).toBeTypeOf("function");
  });
});
