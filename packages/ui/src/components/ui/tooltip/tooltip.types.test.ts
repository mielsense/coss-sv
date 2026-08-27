import { expect, test } from "vitest";
import type {
  TooltipPopupProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
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
