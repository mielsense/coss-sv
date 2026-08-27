import type { Popover as PopoverPrimitive } from "@shardsui/svelte";
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

export type PopoverTriggerState = {
  disabled: boolean;
  open: boolean;
};

export type PopoverRootState<Payload> = {
  payload: Payload | undefined;
};

export type PopoverRootProps<Payload = unknown> = {
  children?: Snippet<[PopoverRootState<Payload>]>;
  defaultOpen?: boolean;
  handle?: PopoverPrimitive.Handle<Payload>;
  modal?: boolean | "trap-focus";
  onOpenChange?: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  open?: boolean | undefined;
  triggerId?: string | null;
};

export type PopoverTriggerProps<Payload = unknown> = Omit<
  HTMLButtonAttributes,
  "children" | "id"
> & {
  as?: keyof HTMLElementTagNameMap;
  children?: Snippet<[PopoverTriggerState]>;
  closeDelay?: number;
  delay?: number;
  disabled?: boolean;
  handle?: PopoverPrimitive.Handle<Payload>;
  id?: string;
  openOnHover?: boolean;
  payload?: Payload;
  ref?: HTMLElement | null;
};
