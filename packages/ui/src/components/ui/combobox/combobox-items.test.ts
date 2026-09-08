import type { ComponentProps } from "svelte";
import { render } from "svelte/server";
import { expect, expectTypeOf, test, vi } from "vitest";
import Fixture from "./combobox-items.browser-fixture.svelte";
import type Root from "./combobox-root.svelte";
import { createComboboxItems, resolveComboboxItems } from "./items.js";

test("SSR resolves an initial ID into its source label and submits the ID", () => {
  const html = render(Fixture).body;
  expect(html).toContain('value="Ada Lovelace"');
  expect(html).toContain('name="person" value="ada"');
  expect(html).not.toContain("[object Object]");
});

test("search inputs suppress native WebKit search decorations", () => {
  const html = render(Fixture, { props: { search: true } }).body;
  for (const pseudo of ["cancel-button", "decoration", "results-button", "results-decoration"]) {
    expect(html).toContain(`webkit-search-${pseudo}]:appearance-none`);
  }
  expect(render(Fixture).body).not.toContain("webkit-search-cancel-button");
});

test("a collection accepts immutable grouped data without deriving values before consumption", () => {
  const ada = Object.freeze({ id: "ada", name: "Ada" });
  const source = Object.freeze([Object.freeze({ label: "People", items: Object.freeze([ada]) })]);
  const getValue = vi.fn((item: typeof ada) => item.id);
  const collection = createComboboxItems(source, { getValue, getLabel: (item) => item.name });
  expect(getValue).not.toHaveBeenCalled();
  const adapter = resolveComboboxItems(collection);
  expect(adapter.items).toEqual([{ label: "People", items: ["ada"] }]);
  expect(adapter.toItem("ada")).toBe(ada);
  expect(source[0]?.items[0]).toBe(ada);
});

test("externally filtered records provide labels and source records absent from the main data", () => {
  const ada = { id: "ada", name: "Ada" };
  const updated = { id: "ada", name: "Ada updated" };
  const grace = { id: "grace", name: "Grace" };
  const collection = createComboboxItems([ada], {
    getValue: (item) => item.id,
    getLabel: (item) => item.name,
  });
  const adapter = resolveComboboxItems(collection, [updated, grace]);
  expect(adapter.getLabel("ada")).toBe("Ada updated");
  expect(adapter.toItem("grace")).toBe(grace);
  expect(adapter.filteredItems).toEqual(["ada", "grace"]);
  expect(adapter.getLabel("missing")).toBeUndefined();
});

test("undefined source data stays empty while loading", () => {
  const items = createComboboxItems(undefined, {
    getValue: (item: { id: number }) => item.id,
    getLabel: (item) => String(item.id),
  });
  expect(resolveComboboxItems(items).items).toBeUndefined();
});

test("primitive IDs preserve their types and reject collisions", () => {
  const items = createComboboxItems([0, false, 1n, "1"], {
    getValue: (item) => item,
    getLabel: String,
  });
  const adapter = resolveComboboxItems(items);
  expect(adapter.items).toEqual([0, false, 1n, "1"]);
  const duplicate = createComboboxItems(["a", "a"], { getValue: (item) => item, getLabel: String });
  expect(() => resolveComboboxItems(duplicate)).toThrow("must be unique");
});

test("root collection types keep source records separate from selected IDs", () => {
  const items = createComboboxItems([{ id: 1, name: "Ada" }], {
    getValue: (item) => item.id,
    getLabel: (item) => item.name,
  });
  type Props = ComponentProps<typeof Root<number, false, { id: number; name: string }>>;
  const props = {
    items,
    defaultValue: 1,
    filter: (item, query) => item.name.includes(query),
  } satisfies Props;
  expectTypeOf(props.defaultValue).toEqualTypeOf<number>();
  expect(props.filter({ id: 1, name: "Ada" }, "Ada")).toBe(true);
  // @ts-expect-error collection values are primitive IDs, not source records
  const invalid: Props = { items, value: { id: 1, name: "Ada" } };
  expect(invalid).toBeDefined();
});
