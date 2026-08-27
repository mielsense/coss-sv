import { expect, expectTypeOf, test } from "vitest";
import { createHandle } from "./index.js";
import type {
  AlertDialogFooterProps,
  AlertDialogPopupProps,
  AlertDialogTriggerProps,
} from "./index.js";
test("types Alert Dialog layout and focus props", () => {
  const popup = {
    bottomStickOnMobile: false,
    finalFocus: true,
    ref: null,
  } satisfies AlertDialogPopupProps;
  const footer = { variant: "bare" } satisfies AlertDialogFooterProps;
  expectTypeOf(popup.ref).toEqualTypeOf<null>();
  expect(footer.variant).toBe("bare");
});
test("preserves the Alert Dialog payload type through handles and triggers", () => {
  const handle = createHandle<{ id: number }>();
  const valid = { handle, payload: { id: 1 } } satisfies AlertDialogTriggerProps<{ id: number }>;
  const invalid = {
    handle,
    // @ts-expect-error Alert Dialog payload must match its parameterized handle.
    payload: { id: "wrong" },
  } satisfies AlertDialogTriggerProps<{ id: number }>;
  expect(valid.payload.id).toBe(1);
  expect(invalid.payload.id).toBe("wrong");
});
