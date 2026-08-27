import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type {
  AutocompleteInputProps,
  AutocompleteItemProps,
  AutocompletePopupProps,
} from "./index.js";

test("types autocomplete native attributes, composed input options, portal props, and item values", () => {
  const children = createRawSnippet(() => ({ render: () => "Apple" }));
  const input = {
    "aria-label": "Fruit",
    name: "fruit",
    showClear: true,
    showTrigger: true,
    size: "lg",
  } satisfies AutocompleteInputProps;
  const popup = {
    children,
    portalProps: { keepMounted: true },
    sideOffset: 8,
  } satisfies AutocompletePopupProps;
  const item = {
    children,
    disabled: false,
    value: { id: "apple" },
  } satisfies AutocompleteItemProps;
  expect(input.size).toBe("lg");
  expect(popup.sideOffset).toBe(8);
  expect(item.disabled).toBe(false);
});
