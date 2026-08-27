import { createContext } from "svelte";

export type CheckboxGroupContext = {
  readonly allValues: readonly string[];
  readonly disabled: boolean;
  readonly value: readonly string[];
  itemInputId: (value: string) => string;
  prepareChange: (event: Event) => void;
  clearPreparedChange: (event: Event) => void;
  registerItem: (value: string, isDisabled: () => boolean) => () => void;
  toggleParent: () => void;
};

export const [getCheckboxGroupContext, setCheckboxGroupContext] =
  createContext<CheckboxGroupContext>();
