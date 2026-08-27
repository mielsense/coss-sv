import type { Menu as ShardsMenu } from "@shardsui/svelte";
import type { ComponentProps, Snippet } from "svelte";
import type { HTMLButtonAttributes, SvelteHTMLElements } from "svelte/elements";

type PartProps<Args extends unknown[] = []> = Omit<SvelteHTMLElements["div"], "children" | "id"> & {
  as?: keyof HTMLElementTagNameMap;
  children?: Snippet<Args>;
  id?: string;
  ref?: HTMLElement | null;
};

export type MenuTriggerState = {
  disabled: boolean;
  open: boolean;
};

export type MenuCheckableItemState = {
  checked: boolean;
  disabled: boolean;
  highlighted: boolean;
};

export type MenuRootState<Payload> = {
  payload: Payload | undefined;
};

export type MenuRootProps<Payload = unknown> = {
  children?: Snippet<[MenuRootState<Payload>]>;
  closeParentOnEsc?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  handle?: ShardsMenu.Handle<Payload>;
  highlightItemOnHover?: boolean;
  loopFocus?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  open?: boolean;
  orientation?: "horizontal" | "vertical";
  triggerId?: string | null;
};

export type MenuTriggerProps<Payload = unknown> = Omit<HTMLButtonAttributes, "children" | "id"> & {
  as?: keyof HTMLElementTagNameMap;
  children?: Snippet<[MenuTriggerState]>;
  closeDelay?: number;
  delay?: number;
  disabled?: boolean;
  handle?: ShardsMenu.Handle<Payload>;
  id?: string;
  openOnHover?: boolean;
  payload?: Payload;
  ref?: HTMLElement | null;
};

type PrimitivePopupProps = ComponentProps<typeof ShardsMenu.Popup>;
type PositionerProps = ComponentProps<typeof ShardsMenu.Positioner>;

export type MenuPopupProps = PrimitivePopupProps & {
  align?: PositionerProps["align"];
  alignOffset?: PositionerProps["alignOffset"];
  anchor?: PositionerProps["anchor"];
  portalProps?: ComponentProps<typeof ShardsMenu.Portal>;
  side?: PositionerProps["side"];
  sideOffset?: PositionerProps["sideOffset"];
};

export type MenuCheckboxItemProps = Omit<
  ComponentProps<typeof ShardsMenu.CheckboxItem>,
  "checked"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  variant?: "default" | "switch";
};

export type MenuGroupProps = ComponentProps<typeof ShardsMenu.Group>;
export type MenuGroupLabelProps = ComponentProps<typeof ShardsMenu.GroupLabel> & {
  inset?: boolean;
};
export type MenuItemProps = ComponentProps<typeof ShardsMenu.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};
export type MenuLinkItemProps = ComponentProps<typeof ShardsMenu.LinkItem> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};
export type MenuRadioGroupProps<Value = unknown> = Omit<
  ComponentProps<typeof ShardsMenu.RadioGroup>,
  "onValueChange" | "value"
> & {
  defaultValue?: Value;
  onValueChange?: (value: Value) => void;
  value?: Value;
};
export type MenuRadioItemProps = PartProps<[MenuCheckableItemState]> & {
  closeOnClick?: boolean;
  disabled?: boolean;
  value: unknown;
};
export type MenuSeparatorProps = Omit<PartProps, "children">;
export type MenuShortcutProps = SvelteHTMLElements["kbd"] & {
  children?: Snippet;
  ref?: HTMLElement | null;
};
export type MenuSubProps = Omit<ComponentProps<typeof ShardsMenu.SubmenuRoot>, "open"> & {
  defaultOpen?: boolean;
  open?: boolean;
};
export type MenuSubTriggerProps = ComponentProps<typeof ShardsMenu.SubmenuTrigger> & {
  inset?: boolean;
};
export type MenuSubPopupProps = Omit<MenuPopupProps, "anchor" | "portalProps" | "side">;
