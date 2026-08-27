import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import CheckboxGroupSsrFixture from "./checkbox-group.ssr-fixture.svelte";
import * as CheckboxGroup from "./index.js";

describe("Checkbox Group SSR contract", () => {
  test("renders the exact COSS root classes, group semantics, disabled state, and parent wiring", () => {
    const { body } = render(CheckboxGroupSsrFixture);

    expect(body).toContain('role="group"');
    expect(body).toContain('id="frameworks-group"');
    expect(body).toContain('aria-labelledby="frameworks-label"');
    expect(body).toContain("flex flex-col items-start gap-3 custom-group");
    expect(body).toContain('data-disabled=""');
    expect(body).toContain('data-parent=""');
    expect(body).toContain('aria-checked="mixed"');
    expect(body).toMatch(/aria-controls="[^"]+-next [^"]+-vite [^"]+-astro"/);
    expect(body).toContain('value="next"');
    expect(body).toContain('data-slot="checkbox"');
  });

  test("exports namespace parts, compatibility aliases, types, and the Shards primitive", () => {
    expect(CheckboxGroup.Root).toBeTypeOf("function");
    expect(CheckboxGroup.Item).toBeTypeOf("function");
    expect(CheckboxGroup.Parent).toBe(CheckboxGroup.Item);
    expect(CheckboxGroup.CheckboxGroup).toBe(CheckboxGroup.Root);
    expect(CheckboxGroup.CheckboxGroupRoot).toBe(CheckboxGroup.Root);
    expect(CheckboxGroup.CheckboxGroupItem).toBe(CheckboxGroup.Item);
    expect(CheckboxGroup.CheckboxGroupPrimitive).toBeTypeOf("function");
  });
});
