import { expect, expectTypeOf, test } from "vitest";
import {
  PreviewCardCreateHandle,
  type PreviewCardPopupProps,
  type PreviewCardRootProps,
  type PreviewCardTriggerProps,
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

test("preserves detached payload types across triggers and root children", () => {
  const handle = PreviewCardCreateHandle<string>();
  const trigger = { handle, payload: "COSS" } satisfies PreviewCardTriggerProps<string>;
  const root = {
    defaultOpen: true,
    handle,
    open: false,
    triggerId: "coss-preview",
  } satisfies PreviewCardRootProps<string>;
  const wrongTrigger: PreviewCardTriggerProps<string> = {
    handle,
    // @ts-expect-error a string handle rejects number payloads
    payload: 42,
  };

  type RootState = Parameters<NonNullable<PreviewCardRootProps<string>["children"]>>[0];
  expectTypeOf<RootState>().toEqualTypeOf<{ payload: string | undefined }>();
  expect(trigger.payload).toBe("COSS");
  expect(root.triggerId).toBe("coss-preview");
  expect(wrongTrigger.payload).toBe(42);
});
