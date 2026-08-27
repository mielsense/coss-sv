import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { KbdGroupProps, KbdProps } from "./index.js";

test("types kbd native attributes, snippets, callback props, and refs", () => {
  const children = createRawSnippet(() => ({ render: () => "K" }));
  const key = {
    children,
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
  } satisfies KbdProps;
  const group = { "aria-label": "Command K", children, ref: null } satisfies KbdGroupProps;

  expectTypeOf(key.onclick).toBeFunction();
  expect(group["aria-label"]).toBe("Command K");
});
