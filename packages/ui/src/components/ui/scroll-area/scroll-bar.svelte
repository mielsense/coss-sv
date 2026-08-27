<script module lang="ts">
import type { ScrollArea as ShardsScrollArea } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type ScrollBarProps = Omit<ComponentProps<typeof ShardsScrollArea.Scrollbar>, "children">;
</script>

<script lang="ts">
import { ScrollArea as ScrollAreaPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let {
  class: className,
  orientation = "vertical",
  ref = $bindable(null),
  ...props
}: ScrollBarProps = $props();

const classes = $derived(
  cn(
    "m-1 flex opacity-0 transition-opacity delay-300 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-100",
    className,
  ),
);
</script>

<ScrollAreaPrimitive.Scrollbar
  bind:ref
  class={classes}
  data-slot="scroll-area-scrollbar"
  {orientation}
  {...props}
>
  <ScrollAreaPrimitive.Thumb
    class="relative flex-1 rounded-full bg-foreground/20"
    data-slot="scroll-area-thumb"
  />
</ScrollAreaPrimitive.Scrollbar>
