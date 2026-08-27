import { createContext } from "svelte";
import type { ToggleSize, ToggleVariant } from "../toggle/toggle-variants.js";

export type ToggleGroupStyleContext = {
  readonly size: ToggleSize;
  readonly variant: ToggleVariant;
};

export const [getToggleGroupStyleContext, setToggleGroupStyleContext] =
  createContext<ToggleGroupStyleContext>();
