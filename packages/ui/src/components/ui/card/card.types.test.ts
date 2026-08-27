import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { CardProps } from "./index.js";

test("types card polymorphism, snippets, callbacks, and refs", () => {
  const props = {
    as: "article",
    children: createRawSnippet(() => ({ render: () => "Card" })),
    class: "custom",
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
  } satisfies CardProps;
  expect(props.as).toBe("article");
  expectTypeOf(props.ref).toEqualTypeOf<null>();
});
