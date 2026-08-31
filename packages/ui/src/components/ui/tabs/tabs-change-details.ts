import type { TabsActivationDirection } from "@shardsui/svelte/tabs";
import { createChangeEventDetails, type ChangeEventDetails } from "@/change-event-details.js";

export type TabsChangeEventReason = "disabled" | "initial" | "missing" | "none";

export type TabsChangeEventDetails = ChangeEventDetails<
  TabsChangeEventReason,
  { readonly activationDirection: TabsActivationDirection }
>;

export function createTabsChangeEventDetails(
  reason: TabsChangeEventReason,
  activationDirection: TabsActivationDirection,
  event: Event | undefined,
  trigger: Element | undefined,
): TabsChangeEventDetails {
  return createChangeEventDetails(reason, event, trigger, { activationDirection });
}
