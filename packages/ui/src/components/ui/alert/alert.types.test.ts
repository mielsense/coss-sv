import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { AlertProps, AlertVariant } from "./index.js";

test("types the alert variant and native div contract", () => {
  expectTypeOf<AlertVariant>().toEqualTypeOf<
    "default" | "error" | "info" | "success" | "warning"
  >();

  const props = {
    "aria-live": "polite",
    children: createRawSnippet(() => ({ render: () => "Heads up" })),
    class: "custom",
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
    variant: "warning",
  } satisfies AlertProps;
  expect(props.variant).toBe("warning");

  const invalid = {
    // @ts-expect-error Alert only accepts documented COSS variants.
    variant: "destructive",
  } satisfies AlertProps;
  expectTypeOf(invalid.variant).toEqualTypeOf<"destructive">();
});
