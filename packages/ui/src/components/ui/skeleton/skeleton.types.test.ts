import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { SkeletonProps } from "./index.js";

test("types skeleton native attributes, snippets, callback props, and refs", () => {
  const children = createRawSnippet(() => ({ render: () => "loading" }));
  const props = {
    "aria-hidden": "true",
    children,
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
  } satisfies SkeletonProps;

  expect(props["aria-hidden"]).toBe("true");
  expectTypeOf(props.onclick).toBeFunction();
});
