import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import {
  PopoverCreateHandle,
  type PopoverPopupProps,
  type PopoverRootProps,
  type PopoverTriggerProps,
} from "./index.js";

test("types state, placement, portals, anchors, refs, and snippets", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const root = { defaultOpen: true, open: false, children } satisfies PopoverRootProps;
  const trigger = {
    as: "button",
    closeDelay: 20,
    delay: 10,
    openOnHover: true,
    ref: null,
  } satisfies PopoverTriggerProps;
  const popup = {
    align: "end",
    alignOffset: 2,
    anchor: null,
    portalProps: { container: null, keepMounted: true },
    side: "top",
    sideOffset: 8,
    tooltipStyle: true,
  } satisfies PopoverPopupProps;

  expect(root.defaultOpen).toBe(true);
  expect(trigger.openOnHover).toBe(true);
  expect(popup.tooltipStyle).toBe(true);
  expect(popup.side).toBe("top");
});

test("preserves detached payload types across triggers and root children", () => {
  const handle = PopoverCreateHandle<string>();
  const trigger = { handle, payload: "Account" } satisfies PopoverTriggerProps<string>;
  const root = {
    defaultOpen: true,
    handle,
    open: false,
    triggerId: "account",
  } satisfies PopoverRootProps<string>;
  const wrongTrigger: PopoverTriggerProps<string> = {
    handle,
    // @ts-expect-error a string handle rejects number payloads
    payload: 42,
  };

  type RootState = Parameters<NonNullable<PopoverRootProps<string>["children"]>>[0];
  expectTypeOf<RootState>().toEqualTypeOf<{ payload: string | undefined }>();
  expect(trigger.payload).toBe("Account");
  expect(root.triggerId).toBe("account");
  expect(wrongTrigger.payload).toBe(42);
});
