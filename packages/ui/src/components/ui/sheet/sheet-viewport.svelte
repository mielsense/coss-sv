<script module lang="ts">
import type { Dialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type SheetSide = "right" | "left" | "top" | "bottom";
export type SheetVariant = "default" | "inset";
export type SheetViewportProps = ComponentProps<typeof ShardsP.Viewport> & {
  side?: SheetSide;
  variant?: SheetVariant;
};
</script>
<script lang="ts">
import { Dialog as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let {
  class: className,
  ref = $bindable(null),
  side,
  variant = "default",
  ...props
}: SheetViewportProps = $props();
const classes = $derived(
  cn(
    "fixed inset-0 z-50 grid",
    side === "bottom" && "grid grid-rows-[1fr_auto] pt-12",
    side === "top" && "grid grid-rows-[auto_1fr] pb-12",
    side === "left" && "flex justify-start",
    side === "right" && "flex justify-end",
    variant === "inset" && "sm:p-4",
    className,
  ),
);
</script>
<P.Viewport bind:ref class={classes} data-slot="sheet-viewport" {...props} />
