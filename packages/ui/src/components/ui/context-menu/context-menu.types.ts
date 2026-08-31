import type { ContextMenu as ShardsContextMenu } from "@shardsui/svelte/context-menu";
import type { ComponentProps, Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type {
  MenuCheckableItemState,
  MenuCheckboxItemProps,
  MenuRadioGroupProps,
} from "../menu/menu.types.js";

type PartProps<Args extends unknown[] = []> = Omit<SvelteHTMLElements["div"], "children" | "id"> & {
  as?: keyof HTMLElementTagNameMap;
  children?: Snippet<Args>;
  id?: string;
  ref?: HTMLElement | null;
};

export type ContextMenuTriggerState = { open: boolean };

export type ContextMenuRootProps = Omit<ComponentProps<typeof ShardsContextMenu.Root>, "open"> & {
  defaultOpen?: boolean;
  open?: boolean;
};
export type ContextMenuTriggerProps = PartProps<[ContextMenuTriggerState]>;
type PrimitivePopupProps = ComponentProps<typeof ShardsContextMenu.Popup>;
type PositionerProps = ComponentProps<typeof ShardsContextMenu.Positioner>;
export type ContextMenuPopupProps = PrimitivePopupProps & {
  align?: PositionerProps["align"];
  alignOffset?: PositionerProps["alignOffset"];
  anchor?: PositionerProps["anchor"];
  portalProps?: ComponentProps<typeof ShardsContextMenu.Portal>;
  side?: PositionerProps["side"];
  sideOffset?: PositionerProps["sideOffset"];
};
export type ContextMenuCheckboxItemProps = MenuCheckboxItemProps;
export type ContextMenuGroupProps = ComponentProps<typeof ShardsContextMenu.Group>;
export type ContextMenuGroupLabelProps = ComponentProps<typeof ShardsContextMenu.GroupLabel> & {
  inset?: boolean;
};
export type ContextMenuItemProps = ComponentProps<typeof ShardsContextMenu.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};
export type ContextMenuLinkItemProps = ComponentProps<typeof ShardsContextMenu.LinkItem> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};
export type ContextMenuRadioGroupProps<Value = unknown> = MenuRadioGroupProps<Value>;
export type ContextMenuRadioItemProps = PartProps<[MenuCheckableItemState]> & {
  closeOnClick?: boolean;
  disabled?: boolean;
  value: unknown;
};
export type ContextMenuSeparatorProps = Omit<PartProps, "children">;
export type ContextMenuShortcutProps = SvelteHTMLElements["kbd"] & {
  children?: Snippet;
  ref?: HTMLElement | null;
};
export type ContextMenuSubProps = Omit<
  ComponentProps<typeof ShardsContextMenu.SubmenuRoot>,
  "open"
> & {
  defaultOpen?: boolean;
  open?: boolean;
};
export type ContextMenuSubTriggerProps = ComponentProps<typeof ShardsContextMenu.SubmenuTrigger> & {
  inset?: boolean;
};
export type ContextMenuSubPopupProps = Omit<
  ContextMenuPopupProps,
  "anchor" | "portalProps" | "side"
>;
