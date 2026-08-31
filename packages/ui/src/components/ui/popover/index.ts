import { Popover as PopoverPrimitive } from "@shardsui/svelte/popover";

export const Handle = PopoverPrimitive.Handle;
export function PopoverCreateHandle<Payload = unknown>() {
  return new PopoverPrimitive.Handle<Payload>();
}
export type {
  PopoverRootProps,
  PopoverRootState,
  PopoverTriggerProps,
  PopoverTriggerState,
} from "./popover.types.js";
export type { PopoverCloseProps } from "./popover-close.svelte";
export { default as Close, default as PopoverClose } from "./popover-close.svelte";
export type { PopoverDescriptionProps } from "./popover-description.svelte";
export {
  default as Description,
  default as PopoverDescription,
} from "./popover-description.svelte";
export type { PopoverPopupProps, PopoverPortalProps } from "./popover-popup.svelte";
export {
  default as Content,
  default as PopoverContent,
  default as PopoverPopup,
  default as Popup,
} from "./popover-popup.svelte";
export { default as Popover, default as PopoverRoot, default as Root } from "./popover-root.svelte";
export type { PopoverTitleProps } from "./popover-title.svelte";
export { default as PopoverTitle, default as Title } from "./popover-title.svelte";
export { default as PopoverTrigger, default as Trigger } from "./popover-trigger.svelte";
export { PopoverPrimitive };
