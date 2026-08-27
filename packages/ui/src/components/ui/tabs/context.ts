import { createContext } from "svelte";
import type { TabsSize, TabsVariant } from "./tabs-styles.js";

export type TabsListStyleContext = {
  readonly size: TabsSize;
  readonly variant: TabsVariant;
};

export const [getTabsListStyleContext, setTabsListStyleContext] =
  createContext<TabsListStyleContext>();
