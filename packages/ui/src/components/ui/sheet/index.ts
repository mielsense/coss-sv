import { Dialog as SheetPrimitive } from "@shardsui/svelte";
export { SheetPrimitive };
export const Root: typeof SheetPrimitive.Root = SheetPrimitive.Root;
export const Sheet: typeof Root = Root;
export const Portal: typeof SheetPrimitive.Portal = SheetPrimitive.Portal;
export const SheetPortal: typeof SheetPrimitive.Portal = Portal;
export const Handle: typeof SheetPrimitive.Handle = SheetPrimitive.Handle;
export const SheetHandle: typeof SheetPrimitive.Handle = Handle;
export { default as Trigger, default as SheetTrigger } from "./sheet-trigger.svelte";
export type { SheetTriggerProps } from "./sheet-trigger.svelte";
export { default as Close, default as SheetClose } from "./sheet-close.svelte";
export type { SheetCloseProps } from "./sheet-close.svelte";
export {
  default as Backdrop,
  default as Overlay,
  default as SheetBackdrop,
  default as SheetOverlay,
} from "./sheet-backdrop.svelte";
export type { SheetBackdropProps } from "./sheet-backdrop.svelte";
export { default as Viewport, default as SheetViewport } from "./sheet-viewport.svelte";
export type { SheetViewportProps, SheetSide, SheetVariant } from "./sheet-viewport.svelte";
export {
  default as Popup,
  default as Content,
  default as SheetPopup,
  default as SheetContent,
} from "./sheet-popup.svelte";
export type { SheetPopupProps } from "./sheet-popup.svelte";
export { default as Header, default as SheetHeader } from "./sheet-header.svelte";
export type { SheetHeaderProps } from "./sheet-header.svelte";
export { default as Footer, default as SheetFooter } from "./sheet-footer.svelte";
export type { SheetFooterProps } from "./sheet-footer.svelte";
export { default as Title, default as SheetTitle } from "./sheet-title.svelte";
export type { SheetTitleProps } from "./sheet-title.svelte";
export { default as Description, default as SheetDescription } from "./sheet-description.svelte";
export type { SheetDescriptionProps } from "./sheet-description.svelte";
export { default as Panel, default as SheetPanel } from "./sheet-panel.svelte";
export type { SheetPanelProps } from "./sheet-panel.svelte";
