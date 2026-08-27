<script module lang="ts">
import type { Popover as ShardsPopover } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type PopoverTriggerProps = ComponentProps<typeof ShardsPopover.Trigger>;
</script>

<script lang="ts">
import { Popover as PopoverPrimitive } from "@shardsui/svelte";

let { children: child, ref = $bindable(null), ...props }: PopoverTriggerProps = $props();
</script>

<PopoverPrimitive.Trigger bind:ref data-slot="popover-trigger" {...props}>
  {#snippet children(state)}
    {@render child?.(state)}
  {/snippet}
</PopoverPrimitive.Trigger>
