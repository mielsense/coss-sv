import { createContext } from "svelte";
import type { TabsActivationDirection } from "@shardsui/svelte/tabs";
import type { TabsSize, TabsVariant } from "./tabs-styles.js";
import type { TabsValue } from "./tabs-value.js";

export type TabsListStyleContext = {
  readonly size: TabsSize;
  readonly variant: TabsVariant;
};

export const [getTabsListStyleContext, setTabsListStyleContext] =
  createContext<TabsListStyleContext>();

export type TabsAdapterTab = {
  readonly disabled: boolean;
  readonly element: HTMLElement;
  readonly value: TabsValue;
};

export type TabsRootAdapterContext = {
  activationDirection(from: TabsValue | undefined, to: TabsValue): TabsActivationDirection;
  consumeEvent(): Event | undefined;
  currentTab(value: TabsValue | undefined): TabsAdapterTab | undefined;
  enabledTabs(): readonly TabsAdapterTab[];
  recordEvent(event: Event): void;
  registerTab(tab: TabsAdapterTab): () => void;
  readonly version: number;
};

export const [getTabsRootAdapterContext, setTabsRootAdapterContext] =
  createContext<TabsRootAdapterContext>();
