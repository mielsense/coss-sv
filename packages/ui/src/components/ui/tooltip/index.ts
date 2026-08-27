import { Tooltip as TooltipPrimitive } from "@shardsui/svelte";
export { TooltipPrimitive };
export {
  TooltipHandle as Handle,
  createTooltipHandle as TooltipCreateHandle,
} from "./handle.svelte.js";
export type { TooltipProviderProps } from "./tooltip-provider.svelte";
export { default as Provider, default as TooltipProvider } from "./tooltip-provider.svelte";
export type { TooltipRootProps } from "./tooltip-root.svelte";
export { default as Root, default as Tooltip, default as TooltipRoot } from "./tooltip-root.svelte";
export type { TooltipTriggerProps } from "./tooltip-trigger.svelte";
export { default as TooltipTrigger, default as Trigger } from "./tooltip-trigger.svelte";
export type { TooltipPopupProps, TooltipPortalProps } from "./tooltip-popup.svelte";
export {
  default as Content,
  default as Popup,
  default as TooltipContent,
  default as TooltipPopup,
} from "./tooltip-popup.svelte";
