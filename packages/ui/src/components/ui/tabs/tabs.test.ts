import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Tabs from "./index.js";
import TabsSsrFixture from "./tabs.ssr-fixture.svelte";

describe("Tabs SSR contract", () => {
  test("renders exact COSS slots, segmented-control styles, state, and panel semantics", () => {
    const { body } = render(TabsSsrFixture);

    expect(body).toContain('data-slot="tabs"');
    expect(body).toContain('data-slot="tabs-list"');
    expect(body).toContain('data-slot="tabs-tab"');
    expect(body).toContain('data-slot="tab-indicator"');
    expect(body).toContain('data-slot="tabs-content"');
    expect(body).toContain('role="tablist"');
    expect(body).toContain('role="tab"');
    expect(body).toContain('role="tabpanel"');
    expect(body).toContain('aria-selected="true"');
    expect(body).toContain('data-size="sm"');
    expect(body).toContain("h-7.5 px-[calc(--spacing(2)-1px)] sm:h-6.5");
    expect(body).toContain("transition-[width,translate] duration-200 ease-in-out");
    expect(body).toContain("flex flex-col gap-2 data-[orientation=vertical]:flex-row");
  });

  test("exports namespace parts, compatibility aliases, types, and Shards primitive", () => {
    expect(Tabs.Root).toBeTypeOf("function");
    expect(Tabs.List).toBeTypeOf("function");
    expect(Tabs.Tab).toBeTypeOf("function");
    expect(Tabs.Trigger).toBe(Tabs.Tab);
    expect(Tabs.Indicator).toBeTypeOf("function");
    expect(Tabs.Panel).toBeTypeOf("function");
    expect(Tabs.Content).toBe(Tabs.Panel);
    expect(Tabs.Tabs).toBe(Tabs.Root);
    expect(Tabs.TabsPrimitive).toBeTypeOf("object");
  });
});
