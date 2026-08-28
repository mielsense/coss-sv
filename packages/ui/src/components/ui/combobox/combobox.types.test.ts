import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  ComboboxChipsProps,
  ComboboxClearProps,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxPopupProps,
  ComboboxRootProps,
  ComboboxValueProps,
} from "./index.js";

test("types single and multiple values, input synchronization, native attributes, and portal props", () => {
  const children = createRawSnippet(() => ({ render: () => "Apple" }));
  const single = {
    items: ["Apple"],
    onInputValueChange: (_value: string) => undefined,
    onValueChange: (_value: string | null) => undefined,
    value: "Apple",
  } satisfies ComboboxRootProps<string>;
  const multiple = {
    items: ["Apple"],
    multiple: true,
    onValueChange: (_value: string[]) => undefined,
    value: ["Apple"],
  } satisfies ComboboxRootProps<string, true>;
  const input = { "aria-label": "Fruit", showClear: true, size: "sm" } satisfies ComboboxInputProps;
  const clear = { children, "data-testid": "clear" } satisfies ComboboxClearProps;
  const popup = { children, portalProps: { keepMounted: true } } satisfies ComboboxPopupProps;
  const chips = { children } satisfies ComboboxChipsProps;
  const item = { children, value: "Apple" } satisfies ComboboxItemProps;
  const valueChildren = createRawSnippet<[value: { id: string } | null]>((_value) => ({
    render: () => "Grace",
  }));
  const value = { children: valueChildren } satisfies ComboboxValueProps<{ id: string }, false>;
  const multipleValueChildren = createRawSnippet<[value: string[]]>((_value) => ({
    render: () => "Apple, Banana",
  }));
  const multipleValue = {
    children: multipleValueChildren,
  } satisfies ComboboxValueProps<string, true>;
  expect(single.value).toBe("Apple");
  expect(multiple.value).toEqual(["Apple"]);
  expect(input.size).toBe("sm");
  expect(clear.children).toBe(children);
  expect(popup.portalProps?.keepMounted).toBe(true);
  expect(chips.children).toBe(children);
  expect(item.value).toBe("Apple");
  expect(value.children).toBe(valueChildren);
  expect(multipleValue.children).toBe(multipleValueChildren);
  expectTypeOf(single.onValueChange).parameter(0).toEqualTypeOf<string | null>();
  expectTypeOf(multiple.onValueChange).parameter(0).toEqualTypeOf<string[]>();
});
