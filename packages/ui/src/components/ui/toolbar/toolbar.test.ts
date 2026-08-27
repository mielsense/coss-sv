import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Toolbar from "./index.js";
import ToolbarSsrFixture from "./toolbar.ssr-fixture.svelte";

describe("Toolbar SSR contract", () => {
  test("renders the exact COSS toolbar, group, separator, and slot contract", () => {
    const { body } = render(ToolbarSsrFixture);
    expect(body).toContain('role="toolbar"');
    expect(body).toContain('data-slot="toolbar"');
    expect(body).toContain("relative flex gap-2 rounded-xl border bg-card");
    expect(body).toContain('data-slot="toolbar-button"');
    expect(body).toMatch(/<button[^>]*type="button"[^>]*data-slot="toolbar-button"/);
    expect(body).toContain('data-slot="toolbar-link"');
    expect(body).toContain('data-slot="toolbar-input"');
    expect(body).toContain('data-slot="toolbar-group"');
    expect(body).toContain("flex items-center gap-1");
    expect(body).toContain('data-slot="toolbar-separator"');
    expect(body).toContain("data-[orientation=vertical]:w-px");
  });

  test("exports namespace parts, long aliases, and the Shards primitive", () => {
    expect(Toolbar.Root).toBeTypeOf("function");
    expect(Toolbar.Toolbar).toBe(Toolbar.Root);
    expect(Toolbar.ToolbarButton).toBe(Toolbar.Button);
    expect(Toolbar.ToolbarPrimitive).toBeTypeOf("object");
  });
});
