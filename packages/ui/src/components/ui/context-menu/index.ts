export { ContextMenu as ContextMenuPrimitive } from "@shardsui/svelte";
export type {
  ContextMenuCheckboxItemProps,
  ContextMenuGroupLabelProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuLinkItemProps,
  ContextMenuPopupProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuRootProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuSubPopupProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuTriggerProps,
  ContextMenuTriggerState,
} from "./context-menu.types.js";
export {
  default as CheckboxItem,
  default as ContextMenuCheckboxItem,
} from "./context-menu-checkbox-item.svelte";
export { default as ContextMenuGroup, default as Group } from "./context-menu-group.svelte";
export {
  default as ContextMenuGroupLabel,
  default as GroupLabel,
  default as Label,
} from "./context-menu-group-label.svelte";
export { default as ContextMenuItem, default as Item } from "./context-menu-item.svelte";
export {
  default as ContextMenuLinkItem,
  default as LinkItem,
} from "./context-menu-link-item.svelte";
export {
  default as Content,
  default as ContextMenuPopup,
  default as Popup,
} from "./context-menu-popup.svelte";
export {
  default as ContextMenuRadioGroup,
  default as RadioGroup,
} from "./context-menu-radio-group.svelte";
export {
  default as ContextMenuRadioItem,
  default as RadioItem,
} from "./context-menu-radio-item.svelte";
export {
  default as ContextMenu,
  default as ContextMenuRoot,
  default as Root,
} from "./context-menu-root.svelte";
export {
  default as ContextMenuSeparator,
  default as Separator,
} from "./context-menu-separator.svelte";
export {
  default as ContextMenuShortcut,
  default as Shortcut,
} from "./context-menu-shortcut.svelte";
export {
  default as ContextMenuSub,
  default as Sub,
  default as SubmenuRoot,
} from "./context-menu-sub.svelte";
export {
  default as ContextMenuSubPopup,
  default as SubContent,
  default as SubPopup,
} from "./context-menu-sub-popup.svelte";
export {
  default as ContextMenuSubTrigger,
  default as SubTrigger,
  default as SubmenuTrigger,
} from "./context-menu-sub-trigger.svelte";
export { default as ContextMenuTrigger, default as Trigger } from "./context-menu-trigger.svelte";

import { ContextMenu as ContextMenuPrimitive } from "@shardsui/svelte";
export const Portal: typeof ContextMenuPrimitive.Portal = ContextMenuPrimitive.Portal;
export const ContextMenuPortal: typeof ContextMenuPrimitive.Portal = ContextMenuPrimitive.Portal;
export const Positioner: typeof ContextMenuPrimitive.Positioner = ContextMenuPrimitive.Positioner;
export const Backdrop: typeof ContextMenuPrimitive.Backdrop = ContextMenuPrimitive.Backdrop;
export const Arrow: typeof ContextMenuPrimitive.Arrow = ContextMenuPrimitive.Arrow;
