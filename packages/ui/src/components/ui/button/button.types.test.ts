import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./index.js";

test("types native, link, polymorphic, loading, callback, and ref props", () => {
  expectTypeOf<ButtonVariant>().toEqualTypeOf<
    "default" | "destructive" | "destructive-outline" | "ghost" | "link" | "outline" | "secondary"
  >();
  expectTypeOf<ButtonSize>().toEqualTypeOf<
    "default" | "icon" | "icon-lg" | "icon-sm" | "icon-xl" | "icon-xs" | "lg" | "sm" | "xl" | "xs"
  >();

  const props = {
    as: "a",
    children: createRawSnippet(() => ({ render: () => "Docs" })),
    href: "/docs",
    loading: false,
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
    rel: "noreferrer",
    size: "sm",
    target: "_blank",
    variant: "outline",
  } satisfies ButtonProps;

  expect(props.href).toBe("/docs");

  const invalid = {
    // @ts-expect-error COSS does not define a `soft` button variant.
    variant: "soft",
  } satisfies ButtonProps;
  expectTypeOf(invalid.variant).toEqualTypeOf<"soft">();
});
