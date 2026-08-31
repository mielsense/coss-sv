import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { CardProps, CardTag } from "./index.js";

test("types card polymorphism, snippets, callbacks, and refs", () => {
  const props = {
    as: "article",
    children: createRawSnippet(() => ({ render: () => "Card" })),
    class: "custom",
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
  } satisfies CardProps<"article">;
  const anchor = {
    as: "a",
    href: "/docs",
    ref: null,
  } satisfies CardProps<"a">;
  const button = {
    as: "button",
    disabled: true,
    type: "button",
    ref: null,
  } satisfies CardProps<"button">;

  expect(props.as).toBe("article");
  expect(anchor.href).toBe("/docs");
  expect(button.disabled).toBe(true);
  expectTypeOf(props.ref).toEqualTypeOf<null>();
  expectTypeOf<"input" extends CardTag ? true : false>().toEqualTypeOf<false>();
});
