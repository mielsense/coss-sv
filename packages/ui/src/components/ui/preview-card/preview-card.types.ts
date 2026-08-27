import type { PreviewCard as PreviewCardPrimitive } from "@shardsui/svelte";
import type { Snippet } from "svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

export type PreviewCardTriggerState = {
  open: boolean;
};

export type PreviewCardRootState<Payload> = {
  payload: Payload | undefined;
};

export type PreviewCardRootProps<Payload = unknown> = {
  children?: Snippet<[PreviewCardRootState<Payload>]>;
  defaultOpen?: boolean;
  handle?: PreviewCardPrimitive.Handle<Payload>;
  onOpenChange?: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  open?: boolean | undefined;
  triggerId?: string | null;
};

export type PreviewCardTriggerProps<Payload = unknown> = Omit<
  HTMLAnchorAttributes,
  "children" | "id"
> & {
  as?: keyof HTMLElementTagNameMap;
  children?: Snippet<[PreviewCardTriggerState]>;
  closeDelay?: number;
  delay?: number;
  handle?: PreviewCardPrimitive.Handle<Payload>;
  id?: string;
  payload?: Payload;
  ref?: HTMLElement | null;
};
