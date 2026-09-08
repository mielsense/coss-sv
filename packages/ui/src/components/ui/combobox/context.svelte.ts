import { createContext } from "svelte";

export interface ComboboxWrapperContext {
  inputInsidePopup: boolean;
  getInitialInputValue(insidePopup: boolean): string;
  chipsRef: HTMLElement | null;
  inputRef: HTMLInputElement | null;
  getCollectionItem(item: unknown): unknown;
  getGroupItems(items: readonly unknown[] | undefined): readonly unknown[] | undefined;
}

export const [getComboboxWrapperContext, setComboboxWrapperContext] =
  createContext<ComboboxWrapperContext>();

export const [getComboboxInputPlacementContext, setComboboxInputPlacementContext] = createContext<{
  readonly insidePopup: boolean;
}>();
