import { expect, test } from "vitest";
import type {
  PreviewCardPopupProps,
  PreviewCardRootProps,
  PreviewCardTriggerProps,
} from "./index.js";

test("types timing, anchors, portals, refs, and controlled state", () => {
  const root = { defaultOpen: true, open: false } satisfies PreviewCardRootProps;
  const trigger = {
    as: "a",
    closeDelay: 50,
    delay: 100,
    href: "/",
  } satisfies PreviewCardTriggerProps;
  const popup = {
    align: "start",
    anchor: null,
    portalProps: { container: null, keepMounted: true },
    sideOffset: 8,
  } satisfies PreviewCardPopupProps;

  expect(root.defaultOpen).toBe(true);
  expect(trigger.href).toBe("/");
  expect(popup.align).toBe("start");
});
