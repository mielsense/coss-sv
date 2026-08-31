import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { ToggleChangeEventDetails, ToggleProps, ToggleSize, ToggleVariant } from "./index.js";

test("types the COSS style props and transparent Shards contract", () => {
  expectTypeOf<ToggleSize>().toEqualTypeOf<"default" | "lg" | "sm">();
  expectTypeOf<ToggleVariant>().toEqualTypeOf<"default" | "outline">();

  const props = {
    "aria-label": "Bookmark",
    as: "span",
    children: createRawSnippet<[Readonly<{ disabled: boolean; pressed: boolean }>]>(() => ({
      render: () => "Bookmark",
    })),
    class: "custom-toggle",
    disabled: false,
    onclick: (_event: MouseEvent) => undefined,
    defaultPressed: true,
    onPressedChange: (_pressed: boolean, details: ToggleChangeEventDetails) => {
      details.cancel();
    },
    pressed: true,
    ref: null,
    size: "lg",
    tabindex: 0,
    value: "bookmark",
    variant: "outline",
  } satisfies ToggleProps;

  expect(props.size).toBe("lg");
  expect(props.variant).toBe("outline");

  const invalidVariant = {
    // @ts-expect-error Toggle only accepts the two COSS variants.
    variant: "ghost",
  } satisfies ToggleProps;
  expectTypeOf(invalidVariant.variant).toEqualTypeOf<"ghost">();

  const invalidSize = {
    // @ts-expect-error Toggle only accepts the three COSS sizes.
    size: "xl",
  } satisfies ToggleProps;
  expectTypeOf(invalidSize.size).toEqualTypeOf<"xl">();
});
