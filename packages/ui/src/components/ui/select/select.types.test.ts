import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  SelectButtonProps,
  SelectGroupLabelProps,
  SelectGroupProps,
  SelectItemProps,
  SelectPopupProps,
  SelectRootProps,
  SelectSeparatorProps,
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
  const typedValueChildren = createRawSnippet<[value: { id: string } | null]>((_value) => ({
    render: () => "Ada",
  }));
  const typedValue = { children: typedValueChildren } satisfies SelectValueProps<{ id: string }>;
  const multipleValueChildren = createRawSnippet<[value: string[]]>((_value) => ({
    render: () => "JavaScript",
  }));
  const multipleValue = {
    children: multipleValueChildren,
  } satisfies SelectValueProps<string, true>;
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
  expect(typedValue.children).toBe(typedValueChildren);
  expect(multipleValue.children).toBe(multipleValueChildren);
  expect(popup.alignItemWithTrigger).toBe(false);
  expect(item.disabled).toBe(true);
  expectTypeOf(single.value).toEqualTypeOf<string>();
  expectTypeOf(multiple.value).toEqualTypeOf<string[]>();
  expectTypeOf(single.onValueChange).parameter(0).toEqualTypeOf<string | null>();
  expectTypeOf(multiple.onValueChange).parameter(0).toEqualTypeOf<string[]>();
});

test("types refs for every delegated select part", () => {
  type PartProps = SelectGroupProps | SelectGroupLabelProps | SelectSeparatorProps;
  const props = { ref: null } satisfies PartProps;

  expect(props.ref).toBeNull();
  expectTypeOf(props.ref).toEqualTypeOf<null>();
  expectTypeOf<PartProps["ref"]>().toEqualTypeOf<HTMLElement | null | undefined>();
});
