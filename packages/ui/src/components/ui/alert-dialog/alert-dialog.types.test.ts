import { expect, expectTypeOf, test } from "vitest";
import type { AlertDialogFooterProps, AlertDialogPopupProps } from "./index.js";
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
