import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  TabsIndicatorProps,
  TabsChangeEventDetails,
  TabsListProps,
  TabsPanelProps,
  TabsRootProps,
  TabsTabProps,
  TabsValue,
} from "./index.js";

test("types every tabs part, values, variants, sizes, bindings, callbacks, refs, and snippets", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = {
    children,
    defaultValue: "one",
    onValueChange: (value, details) => {
      expectTypeOf(value).toEqualTypeOf<TabsValue>();
      expectTypeOf(details).toEqualTypeOf<TabsChangeEventDetails>();
      details.allowPropagation();
      details.cancel();
      return details.activationDirection;
    },
    orientation: "vertical",
    ref: null,
    value: "two",
  } satisfies TabsRootProps;
  const list = {
    activateOnFocus: true,
    children,
    loopFocus: false,
    ref: null,
    size: "lg",
    variant: "underline",
  } satisfies TabsListProps;
  const tab = { children, disabled: false, size: "sm", value: 1 } satisfies TabsTabProps;
  const indicator = { children, ref: null } satisfies TabsIndicatorProps;
  const panel = { children, keepMounted: true, value: null } satisfies TabsPanelProps;

  expect(root.orientation).toBe("vertical");
  expect(list.variant).toBe("underline");
  expect(tab.size).toBe("sm");
  expect(indicator.ref).toBe(null);
  expect(panel.value).toBe(null);
  expectTypeOf(root.value).toEqualTypeOf<string>();
  expectTypeOf<TabsValue>().toEqualTypeOf<unknown>();
  expectTypeOf({ value: { id: 1 } } satisfies TabsTabProps<{ id: number }>).toMatchTypeOf<
    TabsTabProps<{ id: number }>
  >();
  expectTypeOf({ value: { id: 1 } } satisfies TabsPanelProps<{ id: number }>).toMatchTypeOf<
    TabsPanelProps<{ id: number }>
  >();
  expectTypeOf({ defaultValue: null } satisfies TabsRootProps<object>).toMatchTypeOf<
    TabsRootProps<object>
  >();
  expectTypeOf<TabsChangeEventDetails["reason"]>().toEqualTypeOf<
    "disabled" | "initial" | "missing" | "none"
  >();
});
