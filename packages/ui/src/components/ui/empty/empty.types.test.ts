import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { EmptyMediaProps, EmptyMediaVariant, EmptyProps } from "./index.js";

test("types empty native attributes, refs, snippets, and media variants", () => {
  expectTypeOf<EmptyMediaVariant>().toEqualTypeOf<"default" | "icon">();
  const root = {
    children: createRawSnippet(() => ({ render: () => "Nothing here" })),
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
  } satisfies EmptyProps;
  const media = { variant: "icon" } satisfies EmptyMediaProps;
  expect(root.ref).toBeNull();
  expect(media.variant).toBe("icon");

  const invalid = {
    // @ts-expect-error EmptyMedia only accepts documented COSS variants.
    variant: "image",
  } satisfies EmptyMediaProps;
  expectTypeOf(invalid.variant).toEqualTypeOf<"image">();
});
