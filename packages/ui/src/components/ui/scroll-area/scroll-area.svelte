<script module lang="ts">
import type { ScrollArea as ShardsScrollArea } from "@shardsui/svelte";
import type { ComponentProps, Snippet } from "svelte";

type ShardsRootProps = ComponentProps<typeof ShardsScrollArea.Root>;

export type ScrollAreaProps = Omit<ShardsRootProps, "children"> & {
  children?: Snippet;
  clampContentMinWidth?: boolean;
  fill?: boolean;
  overscrollContain?: boolean;
  scrollFade?: boolean;
  scrollbarGutter?: boolean;
};
</script>

<script lang="ts">
import { ScrollArea as ScrollAreaPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import ScrollBar from "./scroll-bar.svelte";

let {
  children,
  clampContentMinWidth = true,
  class: className,
  fill = false,
  overscrollContain = false,
  ref = $bindable(null),
  scrollFade = false,
  scrollbarGutter = false,
  ...props
}: ScrollAreaProps = $props();

const rootClass = $derived(cn("size-full min-h-0", className));
const viewportClass = $derived(
  cn(
    "h-full rounded-[inherit] outline-none transition-shadows focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    overscrollContain &&
      "data-has-overflow-y:overscroll-y-contain data-has-overflow-x:overscroll-x-contain",
    scrollFade &&
      "mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]",
    scrollbarGutter && "data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5",
  ),
);
const contentClass = $derived(cn(fill && "size-full"));
const contentStyle = $derived(clampContentMinWidth ? "min-width: 0" : undefined);
</script>

<ScrollAreaPrimitive.Root bind:ref class={rootClass} {...props}>
  <ScrollAreaPrimitive.Viewport class={viewportClass} data-slot="scroll-area-viewport">
    <ScrollAreaPrimitive.Content
      class={contentClass || undefined}
      data-slot="scroll-area-content"
      style={contentStyle}
    >
      {@render children?.()}
    </ScrollAreaPrimitive.Content>
  </ScrollAreaPrimitive.Viewport>
  <ScrollBar orientation="vertical" />
  <ScrollBar orientation="horizontal" />
  <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
</ScrollAreaPrimitive.Root>
