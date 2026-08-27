import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { SeparatorOrientation, SeparatorProps } from "./index.js";

test("types the COSS and Shards separator contracts", () => {
  expectTypeOf<SeparatorOrientation>().toEqualTypeOf<"horizontal" | "vertical">();

  const children = createRawSnippet(() => ({ render: () => "<span>content</span>" }));
  const props = {
    "aria-label": "Section divider",
    "data-kind": "content",
    as: "section",
    children,
    class: "my-4",
    onclick: (_event: MouseEvent) => undefined,
    orientation: "vertical",
    ref: null,
    tabindex: -1,
  } satisfies SeparatorProps;

  expect(props.orientation).toBe("vertical");
  expectTypeOf(props.orientation).toEqualTypeOf<"vertical">();

  const invalid = {
    // @ts-expect-error Separator only accepts the two Shards orientations.
    orientation: "diagonal",
  } satisfies SeparatorProps;
  expectTypeOf(invalid.orientation).toEqualTypeOf<"diagonal">();
});
