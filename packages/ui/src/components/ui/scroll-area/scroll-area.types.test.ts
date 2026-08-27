import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { ScrollAreaProps, ScrollBarProps } from "./index.js";

test("types the COSS options and Shards root contract", () => {
  const props = {
    "aria-label": "Tags",
    as: "section",
    children: createRawSnippet(() => ({ render: () => "Tags" })),
    clampContentMinWidth: false,
    fill: true,
    onscroll: (_event: Event) => undefined,
    overflowEdgeThreshold: { yStart: 8 },
    overscrollContain: true,
    ref: null,
    scrollFade: true,
    scrollbarGutter: true,
  } satisfies ScrollAreaProps;

  expect(props.as).toBe("section");
  expectTypeOf(props.ref).toEqualTypeOf<null>();
});

test("types scrollbar orientation and native callbacks", () => {
  const props = {
    class: "track",
    keepMounted: true,
    onpointerdown: (_event: PointerEvent) => undefined,
    orientation: "horizontal",
    ref: null,
  } satisfies ScrollBarProps;

  expectTypeOf(props.orientation).toEqualTypeOf<"horizontal">();

  const invalid = {
    // @ts-expect-error ScrollArea only supports horizontal and vertical scrollbars.
    orientation: "diagonal",
  } satisfies ScrollBarProps;
  expect(invalid.orientation).toBe("diagonal");
});
