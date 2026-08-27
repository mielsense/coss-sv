import { createContext } from "svelte";

export interface ComboboxWrapperContext {
  chipsRef: HTMLElement | null;
}

export const [getComboboxWrapperContext, setComboboxWrapperContext] =
  createContext<ComboboxWrapperContext>();
