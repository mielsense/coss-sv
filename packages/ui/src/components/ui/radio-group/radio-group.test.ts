import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as RadioGroup from "./index.js";
import RadioGroupSsrFixture from "./radio-group.ssr-fixture.svelte";

describe("Radio Group SSR contract", () => {
  test("renders the exact COSS group, item, and indicator contract", () => {
    const { body } = render(RadioGroupSsrFixture);

    expect(body).toContain('role="radiogroup"');
    expect(body).toContain('aria-label="Framework"');
    expect(body).toContain('data-slot="radio-group"');
    expect(body).toContain("flex flex-col gap-3 custom-group");
    expect(body).toContain('data-slot="radio"');
    expect(body).toContain("relative inline-flex size-4.5");
    expect(body).toContain("focus-visible:ring-2");
    expect(body).toContain("custom-radio");
    expect(body).toContain('data-slot="radio-indicator"');
    expect(body).toContain("before:size-2");
    expect(body).toContain('data-checked=""');
    expect(body).toContain('name="framework"');
    expect(body).toContain('value="vite"');
  });

  test("keeps the indicator mounted for both checked and unchecked items", () => {
    const { body } = render(RadioGroupSsrFixture);
    const indicators = body.match(/data-slot="radio-indicator"/g) ?? [];

    expect(indicators).toHaveLength(2);
    expect(body).toContain('data-unchecked=""');
  });

  test("exports namespace parts, compatibility aliases, and both Shards primitives", () => {
    expect(RadioGroup.Root).toBeTypeOf("function");
    expect(RadioGroup.Item).toBeTypeOf("function");
    expect(RadioGroup.RadioGroup).toBe(RadioGroup.Root);
    expect(RadioGroup.RadioGroupRoot).toBe(RadioGroup.Root);
    expect(RadioGroup.Radio).toBe(RadioGroup.Item);
    expect(RadioGroup.RadioGroupItem).toBe(RadioGroup.Item);
    expect(RadioGroup.RadioGroupPrimitive).toBeTypeOf("function");
    expect(RadioGroup.RadioPrimitive.Root).toBeTypeOf("function");
    expect(RadioGroup.RadioPrimitive.Indicator).toBeTypeOf("function");
  });
});
