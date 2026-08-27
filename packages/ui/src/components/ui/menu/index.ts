import { Menu as MenuPrimitive } from "@shardsui/svelte";

export { MenuPrimitive };
export const Handle = MenuPrimitive.Handle;
export function createHandle<Payload = unknown>() {
  return new MenuPrimitive.Handle<Payload>();
}
export const MenuCreateHandle = createHandle;
export const DropdownMenuCreateHandle = createHandle;

export type { MenuCheckboxItemProps } from "./menu-checkbox-item.svelte";
export {
  default as CheckboxItem,
  default as DropdownMenuCheckboxItem,
  default as MenuCheckboxItem,
} from "./menu-checkbox-item.svelte";
export type { MenuGroupProps } from "./menu-group.svelte";
export {
  default as DropdownMenuGroup,
  default as Group,
  default as MenuGroup,
} from "./menu-group.svelte";
export type { MenuGroupLabelProps } from "./menu-group-label.svelte";
export {
  default as DropdownMenuLabel,
  default as GroupLabel,
  default as Label,
  default as MenuGroupLabel,
} from "./menu-group-label.svelte";
export type { MenuItemProps } from "./menu-item.svelte";
export {
  default as DropdownMenuItem,
  default as Item,
  default as MenuItem,
} from "./menu-item.svelte";
export type { MenuLinkItemProps } from "./menu-link-item.svelte";
export { default as LinkItem, default as MenuLinkItem } from "./menu-link-item.svelte";
export type { MenuPopupProps } from "./menu-popup.svelte";
export {
  default as Content,
  default as DropdownMenuContent,
  default as MenuPopup,
  default as Popup,
} from "./menu-popup.svelte";
export type { MenuRadioGroupProps } from "./menu-radio-group.svelte";
export {
  default as DropdownMenuRadioGroup,
  default as MenuRadioGroup,
  default as RadioGroup,
} from "./menu-radio-group.svelte";
export type { MenuRadioItemProps } from "./menu-radio-item.svelte";
export {
  default as DropdownMenuRadioItem,
  default as MenuRadioItem,
  default as RadioItem,
} from "./menu-radio-item.svelte";
export type { MenuRootProps } from "./menu-root.svelte";
export {
  default as DropdownMenu,
  default as Menu,
  default as MenuRoot,
  default as Root,
} from "./menu-root.svelte";
export type { MenuSeparatorProps } from "./menu-separator.svelte";
export {
  default as DropdownMenuSeparator,
  default as MenuSeparator,
  default as Separator,
} from "./menu-separator.svelte";
export type { MenuShortcutProps } from "./menu-shortcut.svelte";
export {
  default as DropdownMenuShortcut,
  default as MenuShortcut,
  default as Shortcut,
} from "./menu-shortcut.svelte";
export type { MenuSubProps } from "./menu-sub.svelte";
export {
  default as DropdownMenuSub,
  default as MenuSub,
  default as Sub,
  default as SubmenuRoot,
} from "./menu-sub.svelte";
export type { MenuSubPopupProps } from "./menu-sub-popup.svelte";
export {
  default as DropdownMenuSubContent,
  default as MenuSubPopup,
  default as SubContent,
  default as SubPopup,
} from "./menu-sub-popup.svelte";
export type { MenuSubTriggerProps } from "./menu-sub-trigger.svelte";
export {
  default as DropdownMenuSubTrigger,
  default as MenuSubTrigger,
  default as SubTrigger,
  default as SubmenuTrigger,
} from "./menu-sub-trigger.svelte";
export type { MenuTriggerProps } from "./menu-trigger.svelte";
export {
  default as DropdownMenuTrigger,
  default as MenuTrigger,
  default as Trigger,
} from "./menu-trigger.svelte";

export const Portal: typeof MenuPrimitive.Portal = MenuPrimitive.Portal;
export const MenuPortal: typeof MenuPrimitive.Portal = MenuPrimitive.Portal;
export const DropdownMenuPortal: typeof MenuPrimitive.Portal = MenuPrimitive.Portal;
export const Positioner: typeof MenuPrimitive.Positioner = MenuPrimitive.Positioner;
export const Backdrop: typeof MenuPrimitive.Backdrop = MenuPrimitive.Backdrop;
export const Arrow: typeof MenuPrimitive.Arrow = MenuPrimitive.Arrow;
export const Viewport: typeof MenuPrimitive.Viewport = MenuPrimitive.Viewport;
