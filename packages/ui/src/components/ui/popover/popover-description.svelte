<script module lang="ts">
import type { Popover as ShardsPopover } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type PopoverDescriptionProps = ComponentProps<typeof ShardsPopover.Description>;
</script>
<script lang="ts">
import { Popover as PopoverPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let {
  class: className,
  children: child,
  ref = $bindable(null),
  ...props
}: PopoverDescriptionProps = $props();
</script>
<PopoverPrimitive.Description
  bind:ref
  class={cn("text-muted-foreground text-sm", className)}
  data-slot="popover-description"
  {...props}
>
  {@render child?.()}
</PopoverPrimitive.Description>
