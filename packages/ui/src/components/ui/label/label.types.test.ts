import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type { LabelProps } from "./index.js";

test("types native label attributes, snippets, refs, and polymorphism", () => {
  const props = {
    as: "span",
    children: createRawSnippet(() => ({ render: () => "Name" })),
    class: "gap-3",
    for: "name",
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
  } satisfies LabelProps;
  expect(props.as).toBe("span");
});
