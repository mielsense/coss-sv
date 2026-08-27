import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type { PopoverPopupProps, PopoverRootProps, PopoverTriggerProps } from "./index.js";

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
