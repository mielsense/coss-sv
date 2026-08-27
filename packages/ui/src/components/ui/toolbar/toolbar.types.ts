import type { Snippet } from "svelte";
import type {
  HTMLAnchorAttributes,
  HTMLButtonAttributes,
  HTMLInputAttributes,
  SvelteHTMLElements,
} from "svelte/elements";

export type ToolbarOrientation = "horizontal" | "vertical";
export type ToolbarRootState = {
  disabled: boolean;
  orientation: ToolbarOrientation;
};
export type ToolbarLinkState = { orientation: ToolbarOrientation };

type PartProps<Args extends unknown[] = [], Tag extends "a" | "button" | "div" = "div"> = Omit<
  Tag extends "a"
    ? HTMLAnchorAttributes
    : Tag extends "button"
      ? HTMLButtonAttributes
      : SvelteHTMLElements["div"],
  "children" | "id"
> & {
  as?: keyof HTMLElementTagNameMap;
  children?: Snippet<Args>;
  id?: string;
  ref?: HTMLElement | null;
};

export type ToolbarRootProps = PartProps<[ToolbarRootState]> & {
  disabled?: boolean;
  loopFocus?: boolean;
  orientation?: ToolbarOrientation;
};
export type ToolbarButtonProps = PartProps<[ToolbarRootState], "button"> & {
  disabled?: boolean;
};
export type ToolbarGroupProps = PartProps<[ToolbarRootState]> & { disabled?: boolean };
export type ToolbarInputProps = Omit<HTMLInputAttributes, "children" | "disabled"> & {
  disabled?: boolean;
  ref?: HTMLInputElement | null;
};
export type ToolbarLinkProps = PartProps<[ToolbarLinkState], "a">;
export type ToolbarSeparatorProps = Omit<PartProps, "children"> & {
  orientation?: ToolbarOrientation;
};
