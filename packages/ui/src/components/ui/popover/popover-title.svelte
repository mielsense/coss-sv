<script module lang="ts">
import type { Popover as ShardsPopover } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type PopoverTitleProps = ComponentProps<typeof ShardsPopover.Title>;
</script>
<script lang="ts">
import { Popover as PopoverPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let {
  class: className,
  children: child,
  ref = $bindable(null),
  ...props
}: PopoverTitleProps = $props();
</script>
<PopoverPrimitive.Title
  bind:ref
  class={cn("font-semibold text-lg leading-none", className)}
  data-slot="popover-title"
  {...props}
>
  {@render child?.()}
</PopoverPrimitive.Title>
