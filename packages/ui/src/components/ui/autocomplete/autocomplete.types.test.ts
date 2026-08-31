import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  AutocompleteEmptyProps,
  AutocompleteGroupLabelProps,
  AutocompleteGroupProps,
  AutocompleteInputProps,
  AutocompleteItemProps,
  AutocompletePopupProps,
  AutocompleteRootProps,
  AutocompleteRowProps,
  AutocompleteSeparatorProps,
  AutocompleteStatusProps,
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
  const root = {
    defaultOpen: true,
    defaultValue: "Ap",
    items: [{ id: "apple", label: "Apple" }],
    itemToStringValue: (value: { id: string; label: string }) => value.label,
    onValueChange: (_value: string, details) => details.cancel(),
  } satisfies AutocompleteRootProps<{ id: string; label: string }>;
  expect(input.size).toBe("lg");
  expect(popup.sideOffset).toBe(8);
  expect(item.disabled).toBe(false);
  expect(root.defaultValue).toBe("Ap");
  expectTypeOf(root.onValueChange).parameter(1).toMatchTypeOf<{
    isCanceled: boolean;
    reason: string;
  }>();
});

test("types refs for every delegated autocomplete part", () => {
  type PartProps =
    | AutocompleteEmptyProps
    | AutocompleteGroupProps
    | AutocompleteGroupLabelProps
    | AutocompleteRowProps
    | AutocompleteSeparatorProps
    | AutocompleteStatusProps;
  const props = { ref: null } satisfies PartProps;

  expect(props.ref).toBeNull();
  expectTypeOf(props.ref).toEqualTypeOf<null>();
  expectTypeOf<PartProps["ref"]>().toEqualTypeOf<HTMLElement | null | undefined>();
});
