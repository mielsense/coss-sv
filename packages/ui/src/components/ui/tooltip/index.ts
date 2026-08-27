import { Tooltip as TooltipPrimitive } from "@shardsui/svelte";

export {
  createTooltipHandle as TooltipCreateHandle,
  TooltipHandle as Handle,
} from "./handle.svelte.js";
export type {
  TooltipRootProps,
  TooltipRootState,
  TooltipTriggerProps,
  TooltipTriggerState,
} from "./tooltip.types.js";
export type { TooltipPopupProps, TooltipPortalProps } from "./tooltip-popup.svelte";
export {
  default as Content,
  default as Popup,
  default as TooltipContent,
  default as TooltipPopup,
} from "./tooltip-popup.svelte";
export type { TooltipProviderProps } from "./tooltip-provider.svelte";
export { default as Provider, default as TooltipProvider } from "./tooltip-provider.svelte";
export { default as Root, default as Tooltip, default as TooltipRoot } from "./tooltip-root.svelte";
export { default as TooltipTrigger, default as Trigger } from "./tooltip-trigger.svelte";
export { TooltipPrimitive };
