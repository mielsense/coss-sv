<script module lang="ts">
import type { Tooltip as ShardsTooltip } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
import type { TooltipHandle } from "./handle.svelte.js";
export type TooltipRootProps = Omit<
  ComponentProps<typeof ShardsTooltip.Root>,
  "handle" | "open"
> & {
  defaultOpen?: boolean;
  handle?: TooltipHandle;
  open?: boolean | undefined;
};
</script>
<script lang="ts">
import { Tooltip as TooltipPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";
import { setTooltipHandleContext } from "./context.js";
import { TooltipHandle as TooltipHandleClass } from "./handle.svelte.js";
let {
  children: child,
  defaultOpen,
  handle,
  onOpenChange,
  open = $bindable(),
  triggerId = $bindable(null),
  ...props
}: TooltipRootProps = $props();
const resolvedHandle = untrack(() => handle ?? new TooltipHandleClass());
setTooltipHandleContext(resolvedHandle);
const initialOpen = untrack(() => defaultOpen ?? false);
const getOpen = () => open ?? initialOpen;
function setOpen(next: boolean) {
  onOpenChange?.(next);
  open = next;
}
</script>
<TooltipPrimitive.Root
  bind:open={getOpen, setOpen}
  bind:triggerId
  handle={resolvedHandle}
  {...props}
>
  {#snippet children(state)}
    {@render child?.(state)}
  {/snippet}
</TooltipPrimitive.Root>
