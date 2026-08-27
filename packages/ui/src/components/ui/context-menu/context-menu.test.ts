import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import ContextMenuSsrFixture from "./context-menu.ssr-fixture.svelte";
import * as ContextMenu from "./index.js";

describe("Context Menu SSR contract", () => {
  test("renders the exact COSS point-menu structure and styles", () => {
    const { body } = render(ContextMenuSsrFixture);
    expect(body).toContain('data-slot="context-menu-trigger"');
    expect(body).toContain('data-slot="context-menu-positioner"');
    expect(body).toContain('data-slot="context-menu-popup"');
    expect(body).toContain('data-slot="context-menu-item"');
    expect(body).toContain('data-slot="context-menu-checkbox-item"');
    expect(body).toContain('data-slot="context-menu-radio-item"');
    expect(body).toContain('data-slot="context-menu-sub-trigger"');
    expect(body).toContain('class="lucide lucide-chevron-right ms-auto -me-0.5 opacity-80"');
    expect(body).toContain('data-slot="context-menu-sub-content"');
    expect(body).toContain("max-h-(--available-height) w-full overflow-y-auto p-1");
    const controlledId = body.match(/aria-controls="([^"]+)"/)?.[1];
    expect(controlledId).toBeTruthy();
    expect(body).toContain(`id="${controlledId}"`);

    const secondRender = render(ContextMenuSsrFixture).body;
    expect(secondRender.match(/aria-controls="([^"]+)"/)?.[1]).toBe(controlledId);
  });

  test("exports namespace parts, aliases, and the Shards primitive", () => {
    expect(ContextMenu.Root).toBeTypeOf("function");
    expect(ContextMenu.ContextMenu).toBe(ContextMenu.Root);
    expect(ContextMenu.ContextMenuPopup).toBe(ContextMenu.Popup);
    expect(ContextMenu.Content).toBe(ContextMenu.Popup);
    expect(ContextMenu.SubmenuRoot).toBe(ContextMenu.Sub);
    expect(ContextMenu.ContextMenuPrimitive).toBeTypeOf("object");
  });
});
