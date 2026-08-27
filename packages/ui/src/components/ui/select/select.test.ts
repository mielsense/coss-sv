import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Select from "./index.js";
import Fixture from "./select.ssr-fixture.svelte";
describe("Select SSR and export contract", () => {
  test("renders the exact COSS trigger, value, and label slots", () => {
    const { body } = render(Fixture);
    expect(body).toContain('role="combobox"');
    expect(body).toContain('data-slot="select-label"');
    expect(body).toContain('data-slot="select-trigger"');
    expect(body).toContain('data-slot="select-value"');
    expect(body).toContain("relative inline-flex min-h-9");
  });
  test("exports the compound, aliases, and Shards primitive", () => {
    expect(Select.Select).toBe(Select.Root);
    expect(Select.SelectContent).toBe(Select.Popup);
    expect(Select.SelectPrimitive).toBeTypeOf("object");
  });
});
