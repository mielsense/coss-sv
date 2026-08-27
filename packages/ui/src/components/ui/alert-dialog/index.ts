import { AlertDialog as AlertDialogPrimitive } from "@shardsui/svelte";
export { AlertDialogPrimitive };
export const Root: typeof AlertDialogPrimitive.Root = AlertDialogPrimitive.Root;
export const AlertDialog: typeof Root = Root;
export const Portal: typeof AlertDialogPrimitive.Portal = AlertDialogPrimitive.Portal;
export const AlertDialogPortal: typeof AlertDialogPrimitive.Portal = Portal;
export const Handle: typeof AlertDialogPrimitive.Handle = AlertDialogPrimitive.Handle;
export const AlertDialogHandle: typeof AlertDialogPrimitive.Handle = Handle;
export function createHandle<Payload = unknown>() {
  return new AlertDialogPrimitive.Handle<Payload>();
}
export const AlertDialogCreateHandle = createHandle;
export { default as Trigger, default as AlertDialogTrigger } from "./alert-dialog-trigger.svelte";
export type { AlertDialogTriggerProps } from "./alert-dialog-trigger.svelte";
export { default as Close, default as AlertDialogClose } from "./alert-dialog-close.svelte";
export type { AlertDialogCloseProps } from "./alert-dialog-close.svelte";
export {
  default as Backdrop,
  default as Overlay,
  default as AlertDialogBackdrop,
  default as AlertDialogOverlay,
} from "./alert-dialog-backdrop.svelte";
export type { AlertDialogBackdropProps } from "./alert-dialog-backdrop.svelte";
export {
  default as Viewport,
  default as AlertDialogViewport,
} from "./alert-dialog-viewport.svelte";
export type { AlertDialogViewportProps } from "./alert-dialog-viewport.svelte";
export {
  default as Popup,
  default as Content,
  default as AlertDialogPopup,
  default as AlertDialogContent,
} from "./alert-dialog-popup.svelte";
export type { AlertDialogPopupProps } from "./alert-dialog-popup.svelte";
export { default as Header, default as AlertDialogHeader } from "./alert-dialog-header.svelte";
export type { AlertDialogHeaderProps } from "./alert-dialog-header.svelte";
export { default as Footer, default as AlertDialogFooter } from "./alert-dialog-footer.svelte";
export type { AlertDialogFooterProps } from "./alert-dialog-footer.svelte";
export { default as Title, default as AlertDialogTitle } from "./alert-dialog-title.svelte";
export type { AlertDialogTitleProps } from "./alert-dialog-title.svelte";
export {
  default as Description,
  default as AlertDialogDescription,
} from "./alert-dialog-description.svelte";
export type { AlertDialogDescriptionProps } from "./alert-dialog-description.svelte";
