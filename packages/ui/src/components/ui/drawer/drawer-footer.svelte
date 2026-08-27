<script module lang="ts">
import type { DrawerPartProps } from "./drawer-part.svelte";
export type DrawerFooterProps = DrawerPartProps & {
  allowSelection?: boolean;
  variant?: "default" | "bare";
};
</script>
<script lang="ts">
import { Drawer as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import DrawerPart from "./drawer-part.svelte";
let {
  allowSelection = true,
  class: className,
  ref = $bindable(null),
  variant = "default",
  ...props
}: DrawerFooterProps = $props();
const classes = $derived(
  cn(
    "flex flex-col-reverse gap-2 px-6 pb-(--safe-area-inset-bottom,0px) sm:flex-row sm:justify-end",
    !allowSelection && "cursor-default",
    variant === "default" &&
      "border-t bg-muted/72 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+--spacing(4))]",
    variant === "bare" &&
      "in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pt-3 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+--spacing(6))]",
    className,
  ),
);
</script>
{#if allowSelection}
  <P.Content
    ><DrawerPart bind:ref baseClass={classes} dataSlot="drawer-footer" {...props} /></P.Content
  >
{:else}
  <DrawerPart bind:ref baseClass={classes} dataSlot="drawer-footer" {...props} />
{/if}
