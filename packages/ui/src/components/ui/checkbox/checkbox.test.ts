import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Checkbox, CheckboxPrimitive } from "./index.js";

describe("Checkbox SSR contract", () => {
  test("renders the exact COSS root, indicator, and checkmark contract", () => {
    const { body } = render(Checkbox, {
      props: {
        checked: true,
        class: "custom-checkbox",
        name: "terms",
        value: "yes",
      },
    });

    expect(body).toContain('data-slot="checkbox"');
    expect(body).toContain("relative inline-flex size-4.5");
    expect(body).toContain("focus-visible:ring-2");
    expect(body).toContain("custom-checkbox");
    expect(body).toContain('data-slot="checkbox-indicator"');
    expect(body).toContain('data-checked=""');
    expect(body).toContain('class="size-3.5 sm:size-3"');
    expect(body).toContain('aria-hidden="true"');
    expect(body).toContain('name="terms"');
    expect(body).toContain('value="yes"');
  });

  test("renders the exact indeterminate icon and keeps the indicator mounted when unchecked", () => {
    const indeterminate = render(Checkbox, { props: { indeterminate: true } }).body;
    expect(indeterminate).toContain('class="size-3.5 sm:size-3"');
    expect(indeterminate).toContain('data-indeterminate=""');

    const unchecked = render(Checkbox).body;
    expect(unchecked).toContain('data-slot="checkbox-indicator"');
    expect(unchecked).toContain('data-unchecked=""');
  });

  test("exports the styled wrapper and Shards primitive namespace", () => {
    expect(Checkbox).toBeTypeOf("function");
    expect(CheckboxPrimitive.Root).toBeTypeOf("function");
    expect(CheckboxPrimitive.Indicator).toBeTypeOf("function");
  });
});
