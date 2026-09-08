import { type ComponentProps, createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type List from "./combobox-list.svelte";
import type { ComboboxListProps } from "./index.js";

test("types List item values and indices while preserving static children", () => {
  type Fruit = { label: string; value: string };
  const item = createRawSnippet<[Fruit, number]>((fruit, index) => ({
    render: () => `<span>${index()}: ${fruit().label}</span>`,
  }));
  const list = { item, ref: null } satisfies ComboboxListProps<Fruit>;
  const componentProps = { item } satisfies ComponentProps<typeof List<Fruit>>;
  const children = createRawSnippet<[{ empty: boolean }]>((state) => ({
    render: () => `<span>${state().empty}</span>`,
  }));
  const staticList = { children } satisfies ComboboxListProps;

  expect(list.item).toBe(item);
  expect(componentProps.item).toBe(item);
  expect(staticList.children).toBe(children);
  expectTypeOf<NonNullable<ComboboxListProps<Fruit>["item"]>>().parameter(0).toEqualTypeOf<Fruit>();
  expectTypeOf<NonNullable<ComboboxListProps<Fruit>["item"]>>()
    .parameter(1)
    .toEqualTypeOf<number>();

  // @ts-expect-error List content must use either the item renderer or static children.
  const ambiguous: ComboboxListProps<Fruit> = { item, children };
  expect(ambiguous).toBeDefined();
});
