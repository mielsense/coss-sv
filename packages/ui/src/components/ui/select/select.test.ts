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
    expect(body).toContain(
      "not-in-data-[slot=field]:mb-2 inline-flex cursor-default items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4",
    );
    expect(body).not.toContain(
      'data-slot="select-label" class="px-2 py-1.5 font-medium text-muted-foreground text-xs"',
    );
  });
  test("exports the compound, aliases, and Shards primitive", () => {
    expect(Select.Select).toBe(Select.Root);
    expect(Select.SelectContent).toBe(Select.Popup);
    expect(Select.SelectPrimitive).toBeTypeOf("object");
  });
});
