import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  ComboboxClearProps,
  ComboboxChipsProps,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxPopupProps,
  ComboboxRootProps,
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
  expect(single.value).toBe("Apple");
  expect(multiple.value).toEqual(["Apple"]);
  expect(input.size).toBe("sm");
  expect(clear.children).toBe(children);
  expect(popup.portalProps?.keepMounted).toBe(true);
  expect(chips.children).toBe(children);
  expect(item.value).toBe("Apple");
  expectTypeOf(single.onValueChange).parameter(0).toEqualTypeOf<string | null>();
  expectTypeOf(multiple.onValueChange).parameter(0).toEqualTypeOf<string[]>();
});
