import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type { SpinnerProps } from "./index.js";

test("types native SVG attributes, callbacks, accessible names, and refs", () => {
  const props = {
    "aria-label": "Saving",
    absoluteStrokeWidth: true,
    children: createRawSnippet(() => ({ render: () => "<circle></circle>" })),
    class: "size-4",
    height: 18,
    onclick: (_event: MouseEvent) => undefined,
    ref: null,
    role: "img",
    size: 48,
    strokeWidth: 4,
    width: 16,
  } satisfies SpinnerProps;
  expect(props.role).toBe("img");
  expect(props.size).toBe(48);
  expect(props.strokeWidth).toBe(4);
  expect(props.width).toBe(16);
});
