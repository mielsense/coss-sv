<script lang="ts" generics="Payload = unknown">
import { Popover as PopoverPrimitive } from "@shardsui/svelte";
import type { PopoverTriggerProps } from "./popover.types.js";

let { children: child, ref = $bindable(null), ...props }: PopoverTriggerProps<Payload> = $props();
</script>

<PopoverPrimitive.Trigger bind:ref data-slot="popover-trigger" {...props}>
  {#snippet children(state)}
    {@render child?.(state)}
  {/snippet}
</PopoverPrimitive.Trigger>
