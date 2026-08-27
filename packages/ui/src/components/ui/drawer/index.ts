import { Dialog as DialogPrimitive, Drawer as DrawerPrimitive } from "@shardsui/svelte";
export { DrawerPrimitive };
export { default as Root, default as Drawer } from "./drawer-root.svelte";
export type { DrawerRootProps } from "./drawer-root.svelte";
export const Portal: typeof DialogPrimitive.Portal = DialogPrimitive.Portal;
export const DrawerPortal: typeof DialogPrimitive.Portal = Portal;
export const Handle: typeof DrawerPrimitive.Handle = DrawerPrimitive.Handle;
export const DrawerHandle: typeof DrawerPrimitive.Handle = Handle;
export function createHandle<Payload = unknown>() {
  return new DrawerPrimitive.Handle<Payload>();
}
export const DrawerCreateHandle = createHandle;
export const Provider: typeof DrawerPrimitive.Provider = DrawerPrimitive.Provider;
export const DrawerProvider: typeof DrawerPrimitive.Provider = Provider;
export const Indent: typeof DrawerPrimitive.Indent = DrawerPrimitive.Indent;
export const DrawerIndent: typeof DrawerPrimitive.Indent = Indent;
export const IndentBackground: typeof DrawerPrimitive.IndentBackground =
  DrawerPrimitive.IndentBackground;
export const DrawerIndentBackground: typeof DrawerPrimitive.IndentBackground = IndentBackground;
export { default as Trigger, default as DrawerTrigger } from "./drawer-trigger.svelte";
export type { DrawerTriggerProps } from "./drawer-trigger.svelte";
export { default as Close, default as DrawerClose } from "./drawer-close.svelte";
export type { DrawerCloseProps } from "./drawer-close.svelte";
export { default as SwipeArea, default as DrawerSwipeArea } from "./drawer-swipe-area.svelte";
export type { DrawerSwipeAreaProps } from "./drawer-swipe-area.svelte";
export {
  default as Backdrop,
  default as Overlay,
  default as DrawerBackdrop,
  default as DrawerOverlay,
} from "./drawer-backdrop.svelte";
export type { DrawerBackdropProps } from "./drawer-backdrop.svelte";
export { default as Viewport, default as DrawerViewport } from "./drawer-viewport.svelte";
export type { DrawerViewportProps, DrawerVariant } from "./drawer-viewport.svelte";
export { default as Popup, default as DrawerPopup } from "./drawer-popup.svelte";
export type { DrawerPopupProps } from "./drawer-popup.svelte";
export { default as Header, default as DrawerHeader } from "./drawer-header.svelte";
export type { DrawerHeaderProps } from "./drawer-header.svelte";
export { default as Footer, default as DrawerFooter } from "./drawer-footer.svelte";
export type { DrawerFooterProps } from "./drawer-footer.svelte";
export { default as Title, default as DrawerTitle } from "./drawer-title.svelte";
export type { DrawerTitleProps } from "./drawer-title.svelte";
export { default as Description, default as DrawerDescription } from "./drawer-description.svelte";
export type { DrawerDescriptionProps } from "./drawer-description.svelte";
export { default as Panel, default as DrawerPanel } from "./drawer-panel.svelte";
export type { DrawerPanelProps } from "./drawer-panel.svelte";
export { default as Bar, default as DrawerBar } from "./drawer-bar.svelte";
export type { DrawerBarProps } from "./drawer-bar.svelte";
export { default as Content, default as DrawerContent } from "./drawer-content.svelte";
export type { DrawerContentProps } from "./drawer-content.svelte";
export { default as Menu, default as DrawerMenu } from "./drawer-menu.svelte";
export type { DrawerMenuProps } from "./drawer-menu.svelte";
export {
  default as MenuItem,
  default as DrawerMenuItem,
  drawerMenuItemVariants,
} from "./drawer-menu-item.svelte";
export type { DrawerMenuItemProps, DrawerMenuItemVariant } from "./drawer-menu-item.svelte";
export {
  default as MenuSeparator,
  default as DrawerMenuSeparator,
} from "./drawer-menu-separator.svelte";
export type { DrawerMenuSeparatorProps } from "./drawer-menu-separator.svelte";
export { default as MenuGroup, default as DrawerMenuGroup } from "./drawer-menu-group.svelte";
export type { DrawerMenuGroupProps } from "./drawer-menu-group.svelte";
export {
  default as MenuGroupLabel,
  default as DrawerMenuGroupLabel,
} from "./drawer-menu-group-label.svelte";
export type { DrawerMenuGroupLabelProps } from "./drawer-menu-group-label.svelte";
export { default as MenuTrigger, default as DrawerMenuTrigger } from "./drawer-menu-trigger.svelte";
export type { DrawerMenuTriggerProps } from "./drawer-menu-trigger.svelte";
export {
  default as MenuCheckboxItem,
  default as DrawerMenuCheckboxItem,
} from "./drawer-menu-checkbox-item.svelte";
export type { DrawerMenuCheckboxItemProps } from "./drawer-menu-checkbox-item.svelte";
export {
  default as MenuRadioGroup,
  default as DrawerMenuRadioGroup,
} from "./drawer-menu-radio-group.svelte";
export type { DrawerMenuRadioGroupProps } from "./drawer-menu-radio-group.svelte";
export {
  default as MenuRadioItem,
  default as DrawerMenuRadioItem,
} from "./drawer-menu-radio-item.svelte";
export type { DrawerMenuRadioItemProps } from "./drawer-menu-radio-item.svelte";
export type { DrawerPosition } from "./context.js";
export type DrawerSnapPoint = NonNullable<
  import("./drawer-root.svelte").DrawerRootProps["snapPoints"]
>[number];
export type DrawerSwipeDirection = NonNullable<
  import("./drawer-root.svelte").DrawerRootProps["swipeDirection"]
>;
