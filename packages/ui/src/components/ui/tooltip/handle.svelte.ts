import { Tooltip as TooltipPrimitive } from "@shardsui/svelte";

export class TooltipHandle<Payload = unknown> extends TooltipPrimitive.Handle<Payload> {
  popupId = $state<string | undefined>(undefined);
}

export function createTooltipHandle<Payload = unknown>(): TooltipHandle<Payload> {
  return new TooltipHandle<Payload>();
}
