import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { BadgeProps, BadgeSize, BadgeVariant } from "./index.js";

test("types badge variants, sizes, native attributes, and polymorphic links", () => {
  expectTypeOf<BadgeSize>().toEqualTypeOf<"default" | "lg" | "sm">();
  expectTypeOf<BadgeVariant>().toEqualTypeOf<
    "default" | "destructive" | "error" | "info" | "outline" | "secondary" | "success" | "warning"
  >();

  const props = {
    as: "a",
    children: createRawSnippet(() => ({ render: () => "New" })),
    href: "/pricing",
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
    size: "sm",
    variant: "outline",
  } satisfies BadgeProps;
  expect(props.href).toBe("/pricing");
});
