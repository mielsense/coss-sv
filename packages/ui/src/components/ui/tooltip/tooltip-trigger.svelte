<script module lang="ts">
import type { Tooltip as ShardsTooltip } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
import type { TooltipHandle } from "./handle.svelte.js";
export type TooltipTriggerProps = Omit<ComponentProps<typeof ShardsTooltip.Trigger>, "handle"> & {
  handle?: TooltipHandle;
};
</script>
<script lang="ts">
import { Tooltip as TooltipPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";
import { getTooltipHandleContext } from "./context.js";
let {
  "aria-describedby": ariaDescribedby,
  children: child,
  handle,
  ref = $bindable(null),
  ...props
}: TooltipTriggerProps = $props();
const resolvedHandle = untrack(() => handle ?? getTooltipHandleContext());
const descriptionId = $derived(ariaDescribedby ?? resolvedHandle.popupId);
</script>
<TooltipPrimitive.Trigger
  aria-describedby={descriptionId}
  bind:ref
  data-slot="tooltip-trigger"
  handle={resolvedHandle}
  {...props}
>
  {#snippet children(state)}
    {@render child?.(state)}
  {/snippet}
</TooltipPrimitive.Trigger>
