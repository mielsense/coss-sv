import { getContext, setContext } from "svelte";
import type { ChangeEventDetails } from "@/change-event-details.js";

export type ToggleGroupItemChangeContext = {
  consume(): ChangeEventDetails<"none"> | undefined;
  prepare(details: ChangeEventDetails<"none">): void;
};

const toggleGroupItemChangeContextKey = Symbol("coss-toggle-group-item-change");

export function getToggleGroupItemChangeContext(): ToggleGroupItemChangeContext | undefined {
  return getContext<ToggleGroupItemChangeContext | undefined>(toggleGroupItemChangeContextKey);
}

export function setToggleGroupItemChangeContext(
  context: ToggleGroupItemChangeContext,
): ToggleGroupItemChangeContext {
  return setContext(toggleGroupItemChangeContextKey, context);
}
