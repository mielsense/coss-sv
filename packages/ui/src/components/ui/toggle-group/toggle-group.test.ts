import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as ToggleGroup from "./index.js";
import ToggleGroupSsrFixture from "./toggle-group.ssr-fixture.svelte";

describe("Toggle Group SSR contract", () => {
  test("renders exact root, item, separator, inheritance, and selection attributes", () => {
    const { body } = render(ToggleGroupSsrFixture);

    expect(body).toContain('role="group"');
    expect(body).toContain('data-slot="toggle-group"');
    expect(body).toContain('data-size="sm"');
    expect(body).toContain('data-variant="outline"');
    expect(body).toContain('data-orientation="horizontal"');
    expect(body).toContain('aria-label="Text formatting"');
    expect(body).toContain('aria-pressed="true"');
    expect(body).toContain('aria-label="Toggle bold"');
    expect(body).toContain('aria-label="Toggle italic"');
    expect(body).toContain('data-slot="separator"');
    expect(body).toContain("pointer-events-none relative bg-input");
    expect(body).toContain("h-8 min-w-8");
    expect(body).toContain("border-input bg-background");
  });

  test("exports the compound namespace, compatibility aliases, and Shards primitive", () => {
    expect(ToggleGroup.Root).toBeTypeOf("function");
    expect(ToggleGroup.Item).toBeTypeOf("function");
    expect(ToggleGroup.Separator).toBeTypeOf("function");
    expect(ToggleGroup.ToggleGroupRoot).toBe(ToggleGroup.Root);
    expect(ToggleGroup.ToggleGroupItem).toBe(ToggleGroup.Item);
    expect(ToggleGroup.ToggleGroupSeparator).toBe(ToggleGroup.Separator);
    expect(ToggleGroup.ToggleGroupPrimitive).toBeTypeOf("function");
  });
});
