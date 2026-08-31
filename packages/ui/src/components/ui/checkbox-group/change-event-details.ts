import { createChangeEventDetails, type ChangeEventDetails } from "@/change-event-details.js";

export type CheckboxGroupChangeEventDetails = ChangeEventDetails<"none">;

export function createCheckboxGroupChangeEventDetails(
  event: Event = new Event("base-ui"),
): CheckboxGroupChangeEventDetails {
  const trigger = event.currentTarget instanceof Element ? event.currentTarget : undefined;
  return createChangeEventDetails("none", event, trigger);
}
