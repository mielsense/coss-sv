import { expect, expectTypeOf, test } from "vitest";
import { createHandle } from "./index.js";
import type { SheetPopupProps, SheetSide, SheetTriggerProps, SheetVariant } from "./index.js";
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
test("preserves the Sheet payload type through handles and triggers", () => {
  const handle = createHandle<{ id: number }>();
  const valid = { handle, payload: { id: 1 } } satisfies SheetTriggerProps<{ id: number }>;
  const invalid = {
    handle,
    // @ts-expect-error Sheet payload must match its parameterized handle.
    payload: { id: "wrong" },
  } satisfies SheetTriggerProps<{ id: number }>;
  expect(valid.payload.id).toBe(1);
  expect(invalid.payload.id).toBe("wrong");
});
