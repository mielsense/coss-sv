import { expect, expectTypeOf, test } from "vitest";
import type { SheetPopupProps, SheetSide, SheetVariant } from "./index.js";
test("types Sheet side and inset options", () => {
  const props = { ref: null, side: "left", variant: "inset" } satisfies SheetPopupProps;
  expectTypeOf(props.side).toEqualTypeOf<"left">();
  expectTypeOf<SheetSide>().toEqualTypeOf<"right" | "left" | "top" | "bottom">();
  expectTypeOf<SheetVariant>().toEqualTypeOf<"default" | "inset">();
  const invalid = {
    // @ts-expect-error Sheet only supports an edge side.
    side: "center",
  } satisfies SheetPopupProps;
  expect(invalid.side).toBe("center");
});
