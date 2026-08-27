<script module lang="ts">
import type { Drawer as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
import type { DrawerPosition } from "./context.js";
export type DrawerSwipeAreaProps = ComponentProps<typeof ShardsP.SwipeArea> & {
  position?: DrawerPosition;
};
</script>
<script lang="ts">
import { Drawer as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import { getDrawerPositionContext } from "./context.js";
let {
  class: className,
  position: positionProp,
  ref = $bindable(null),
  ...props
}: DrawerSwipeAreaProps = $props();
const context = getDrawerPositionContext();
const position = $derived(positionProp ?? context.position);
const classes = $derived(
  cn(
    "fixed z-50 touch-none",
    position === "bottom" && "inset-x-0 bottom-0 h-8",
    position === "top" && "inset-x-0 top-0 h-8",
    position === "left" && "inset-y-0 left-0 w-8",
    position === "right" && "inset-y-0 right-0 w-8",
    className,
  ),
);
</script>
<P.SwipeArea bind:ref class={classes} data-slot="drawer-swipe-area" {...props} />
