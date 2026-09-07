import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { canonicalizeSelectionValue } from "@/selection-change-context.js";
import * as Select from "./index.js";
import Fixture from "./select.ssr-fixture.svelte";

describe("Select SSR and export contract", () => {
  test("renders the exact COSS trigger, value, and label slots", () => {
    const { body } = render(Fixture);
    expect(body).toContain('role="combobox"');
    expect(body).toContain('data-slot="select-label"');
    expect(body).toContain('data-slot="select-trigger"');
    expect(body).toContain('data-slot="select-value"');
    expect(body).toContain('data-slot="select-button"');
    expect(body.match(/<svg/g)?.length).toBeGreaterThanOrEqual(4);
    expect(body.match(/stroke-width="2"/g)?.length).toBeGreaterThanOrEqual(4);
    expect(body).toContain("relative inline-flex min-h-9");
    expect(body).toContain(
      "not-in-data-[slot=field]:mb-2 inline-flex cursor-default items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4",
    );
    expect(body).not.toContain(
      'data-slot="select-label" class="px-2 py-1.5 font-medium text-muted-foreground text-xs"',
    );
  });
  test("renders literal and typed object value snippets without recursion", () => {
    const { body } = render(Fixture);
    expect(body).toContain('data-testid="select-literal-value">Literal renderer</span>');
    expect(body).toContain('data-testid="select-object-value">Grace Hopper</span>');
  });
  test("exports the compound, aliases, and Shards primitive", () => {
    expect(Select.Select).toBe(Select.Root);
    expect(Select.SelectContent).toBe(Select.Popup);
    expect(Select.SelectPrimitive).toBeTypeOf("object");
  });
});

describe("Select object identity contract", () => {
  test("does not merge distinct values with equal primitive fields", () => {
    const first = { label: "Alex", details: { team: "first" } };
    const second = { label: "Alex", details: { team: "second" } };
    const items = [
      { label: "Alex", value: first },
      { label: "Alex", value: second },
    ];
    expect(canonicalizeSelectionValue(second, items)).toBe(second);
    const external = { label: "Alex", details: { team: "external" } };
    expect(canonicalizeSelectionValue(external, items)).toBe(external);
  });

  test("uses the explicit comparer for separately created equivalent values", () => {
    const first = { id: 1, label: "Alex" };
    const second = { id: 2, label: "Alex" };
    const items = [
      {
        items: [
          { label: "Alex", value: first },
          { label: "Alex", value: second },
        ],
      },
    ];
    expect(canonicalizeSelectionValue({ ...second }, items, (a, b) => a.id === b.id)).toBe(second);
  });
});
