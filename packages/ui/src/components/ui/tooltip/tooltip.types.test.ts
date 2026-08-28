import type { Attachment } from "svelte/attachments";
import { expect, expectTypeOf, test } from "vitest";
import {
  createTriggerAttachment,
  TooltipCreateHandle,
  type TooltipPopupProps,
  type TooltipProviderProps,
  type TooltipRootProps,
  type TooltipTriggerProps,
} from "./index.js";

test("types provider delays, root state, trigger behavior, portals, and placement", () => {
  const provider = { closeDelay: 10, delay: 20, timeout: 400 } satisfies TooltipProviderProps;
  const root = {
    defaultOpen: true,
    disableHoverablePopup: true,
    trackCursorAxis: "x",
  } satisfies TooltipRootProps;
  const trigger = {
    closeOnClick: false,
    delay: 0,
    disabled: false,
    ref: null,
  } satisfies TooltipTriggerProps;
  const popup = {
    align: "center",
    anchor: null,
    portalProps: { container: null, keepMounted: true },
    side: "right",
    sideOffset: 8,
  } satisfies TooltipPopupProps;

  expect(provider.timeout).toBe(400);
  expect(root.trackCursorAxis).toBe("x");
  expect(trigger.closeOnClick).toBe(false);
  expect(popup.side).toBe("right");
});

test("types the reusable trigger attachment for real target elements", () => {
  const handle = TooltipCreateHandle<string>();
  const attachment = createTriggerAttachment(handle, () => ({
    ariaDescribedBy: "format-description",
    closeDelay: 20,
    closeOnClick: false,
    delay: 10,
    disabled: false,
    id: "format-trigger",
    payload: "Format",
  }));
  expectTypeOf(attachment).toEqualTypeOf<Attachment<HTMLElement>>();
  expect(attachment).toBeTypeOf("function");

  createTriggerAttachment(handle, () => ({
    id: "wrong-payload",
    // @ts-expect-error a string handle rejects number payloads
    payload: 42,
  }));
});

test("preserves detached payload types across triggers and root children", () => {
  const handle = TooltipCreateHandle<string>();
  const trigger = { handle, payload: "Helpful hint" } satisfies TooltipTriggerProps<string>;
  const root = {
    defaultOpen: true,
    handle,
    open: false,
    triggerId: "format-tooltip",
  } satisfies TooltipRootProps<string>;
  const wrongTrigger: TooltipTriggerProps<string> = {
    handle,
    // @ts-expect-error a string handle rejects number payloads
    payload: 42,
  };

  type RootState = Parameters<NonNullable<TooltipRootProps<string>["children"]>>[0];
  expectTypeOf<RootState>().toEqualTypeOf<{ payload: string | undefined }>();
  expect(trigger.payload).toBe("Helpful hint");
  expect(root.triggerId).toBe("format-tooltip");
  expect(wrongTrigger.payload).toBe(42);
});
