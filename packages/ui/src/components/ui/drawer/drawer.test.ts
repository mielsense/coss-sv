import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Drawer from "./index.js";
import DrawerFixture from "./drawer.ssr-fixture.svelte";

describe("Drawer SSR contract", () => {
  test("exports styled namespace aliases", () => {
    expect(Drawer.Root).toBe(Drawer.Drawer);
    expect(Drawer.Overlay).toBe(Drawer.Backdrop);
    expect(Drawer.DrawerPortal).toBe(Drawer.Portal);
    expect(Drawer.DrawerHandle).toBe(Drawer.Handle);
    expect(Drawer.DrawerCreateHandle()).toBeInstanceOf(Drawer.Handle);
    expect(Drawer.drawerMenuItemVariants()).toContain("min-h-9");
    expect(Drawer.DrawerPrimitive.Root).toBeTypeOf("function");
  });

  test("maps positions and renders the COSS variants", () => {
    const body = render(DrawerFixture).body;
    expect(body).toContain('data-position="bottom"');
    expect(body).toContain('data-position="top"');
    expect(body).toContain('data-position="left"');
    expect(body).toContain('data-position="right"');
    expect(body).toContain('data-slot="drawer-bar"');
    expect(body).toContain("sm:rounded-2xl sm:border");
  });
});
