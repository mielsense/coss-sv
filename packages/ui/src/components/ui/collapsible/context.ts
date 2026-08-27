import type { Collapsible as ShardsCollapsible } from "@shardsui/svelte";
import { type ComponentProps, createContext, type Snippet } from "svelte";

type ShardsCollapsibleTriggerProps = ComponentProps<typeof ShardsCollapsible.Trigger>;

export type CollapsibleState =
  NonNullable<ShardsCollapsibleTriggerProps["children"]> extends Snippet<[infer State]>
    ? State
    : never;

export type CollapsibleDelegateContext = {
  panelId: string | undefined;
  registerPanelId: (id: string) => () => void;
  setOpen: (open: boolean) => void;
  state: CollapsibleState;
};

export const [getCollapsibleDelegateContext, setCollapsibleDelegateContext] =
  createContext<CollapsibleDelegateContext>();
