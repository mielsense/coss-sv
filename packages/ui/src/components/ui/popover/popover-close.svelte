<script module lang="ts">
import type { Popover as ShardsPopover } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type PopoverCloseProps = ComponentProps<typeof ShardsPopover.Close>;
</script>
<script lang="ts">
import { Popover as PopoverPrimitive } from "@shardsui/svelte";
let { children: child, ref = $bindable(null), ...props }: PopoverCloseProps = $props();
</script>
<PopoverPrimitive.Close bind:ref data-slot="popover-close" {...props}>
  {@render child?.()}
</PopoverPrimitive.Close>
