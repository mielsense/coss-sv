import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  SelectButtonProps,
  SelectItemProps,
  SelectPopupProps,
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
} from "./index.js";
test("types single and multiple values, trigger sizes, value snippets, alignment, and portal props", () => {
  const children = createRawSnippet(() => ({ render: () => "Next.js" }));
  const single = {
    "aria-label": "Framework",
    items: ["next"],
    onValueChange: (_value: string | null) => undefined,
    value: "next",
  } satisfies SelectRootProps<string>;
  const multiple = {
    items: ["js"],
    multiple: true,
    onValueChange: (_value: string[]) => undefined,
    value: ["js"],
  } satisfies SelectRootProps<string, true>;
  const trigger = { children, size: "lg" } satisfies SelectTriggerProps;
  const button = { children, size: "sm" } satisfies SelectButtonProps;
  const value = { placeholder: "Choose" } satisfies SelectValueProps;
  const popup = {
    alignItemWithTrigger: false,
    children,
    portalProps: { keepMounted: true },
    sideOffset: 8,
  } satisfies SelectPopupProps;
  const item = { children, disabled: true, value: "astro" } satisfies SelectItemProps;
  expect(single.value).toBe("next");
  expect(single["aria-label"]).toBe("Framework");
  expect(multiple.value).toEqual(["js"]);
  expect(trigger.size).toBe("lg");
  expect(button.size).toBe("sm");
  expect(value.placeholder).toBe("Choose");
  expect(popup.alignItemWithTrigger).toBe(false);
  expect(item.disabled).toBe(true);
  expectTypeOf(single.value).toEqualTypeOf<string>();
  expectTypeOf(multiple.value).toEqualTypeOf<string[]>();
  expectTypeOf(single.onValueChange).parameter(0).toEqualTypeOf<string | null>();
  expectTypeOf(multiple.onValueChange).parameter(0).toEqualTypeOf<string[]>();
});
