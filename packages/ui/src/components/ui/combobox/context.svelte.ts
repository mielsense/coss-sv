import { createContext } from "svelte";

export interface ComboboxWrapperContext {
  inputInsidePopup: boolean;
  getInitialInputValue(insidePopup: boolean): string;
  chipsRef: HTMLElement | null;
}

export const [getComboboxWrapperContext, setComboboxWrapperContext] =
  createContext<ComboboxWrapperContext>();

export const [getComboboxInputPlacementContext, setComboboxInputPlacementContext] = createContext<{
  readonly insidePopup: boolean;
}>();
