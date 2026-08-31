import { Dialog as DialogPrimitive } from "@shardsui/svelte/dialog";

export { DialogPrimitive };
export const Root: typeof DialogPrimitive.Root = DialogPrimitive.Root;
export const Dialog: typeof DialogPrimitive.Root = Root;
export const Portal: typeof DialogPrimitive.Portal = DialogPrimitive.Portal;
export const DialogPortal: typeof DialogPrimitive.Portal = Portal;
export const Handle: typeof DialogPrimitive.Handle = DialogPrimitive.Handle;
export const DialogHandle: typeof DialogPrimitive.Handle = Handle;
export function createHandle<Payload = unknown>() {
  return new DialogPrimitive.Handle<Payload>();
}
export const DialogCreateHandle = createHandle;

export { default as Trigger, default as DialogTrigger } from "./dialog-trigger.svelte";
export type { DialogTriggerProps } from "./dialog-trigger.svelte";
export { default as Close, default as DialogClose } from "./dialog-close.svelte";
export type { DialogCloseProps } from "./dialog-close.svelte";
export {
  default as Backdrop,
  default as DialogBackdrop,
  default as Overlay,
  default as DialogOverlay,
} from "./dialog-backdrop.svelte";
export type { DialogBackdropProps } from "./dialog-backdrop.svelte";
export { default as Viewport, default as DialogViewport } from "./dialog-viewport.svelte";
export type { DialogViewportProps } from "./dialog-viewport.svelte";
export {
  default as Popup,
  default as DialogPopup,
  default as Content,
  default as DialogContent,
} from "./dialog-popup.svelte";
export type { DialogPopupProps } from "./dialog-popup.svelte";
export { default as Header, default as DialogHeader } from "./dialog-header.svelte";
export type { DialogHeaderProps } from "./dialog-header.svelte";
export { default as Footer, default as DialogFooter } from "./dialog-footer.svelte";
export type { DialogFooterProps } from "./dialog-footer.svelte";
export { default as Title, default as DialogTitle } from "./dialog-title.svelte";
export type { DialogTitleProps } from "./dialog-title.svelte";
export { default as Description, default as DialogDescription } from "./dialog-description.svelte";
export type { DialogDescriptionProps } from "./dialog-description.svelte";
export { default as Panel, default as DialogPanel } from "./dialog-panel.svelte";
export type { DialogPanelProps } from "./dialog-panel.svelte";
