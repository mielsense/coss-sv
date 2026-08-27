import { PreviewCard as PreviewCardPrimitive } from "@shardsui/svelte";

export const Handle = PreviewCardPrimitive.Handle;
export function PreviewCardCreateHandle<Payload = unknown>() {
  return new PreviewCardPrimitive.Handle<Payload>();
}
export type {
  PreviewCardRootProps,
  PreviewCardRootState,
  PreviewCardTriggerProps,
  PreviewCardTriggerState,
} from "./preview-card.types.js";
export type { PreviewCardPopupProps, PreviewCardPortalProps } from "./preview-card-popup.svelte";
export {
  default as HoverCardContent,
  default as Popup,
  default as PreviewCardPopup,
} from "./preview-card-popup.svelte";
export {
  default as HoverCard,
  default as PreviewCard,
  default as Root,
} from "./preview-card-root.svelte";
export {
  default as HoverCardTrigger,
  default as PreviewCardTrigger,
  default as Trigger,
} from "./preview-card-trigger.svelte";
export { PreviewCardPrimitive };
