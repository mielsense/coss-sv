<script module lang="ts">
import type { DrawerPartProps } from "./drawer-part.svelte";
export type DrawerHeaderProps = DrawerPartProps & { allowSelection?: boolean };
</script>
<script lang="ts">
import { Drawer as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import DrawerPart from "./drawer-part.svelte";
let {
  allowSelection = false,
  class: className,
  ref = $bindable(null),
  ...props
}: DrawerHeaderProps = $props();
const classes = $derived(
  cn(
    "flex flex-col gap-2 p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pb-3 max-sm:pb-4",
    !allowSelection && "cursor-default",
    className,
  ),
);
</script>
{#if allowSelection}
  <P.Content
    ><DrawerPart bind:ref baseClass={classes} dataSlot="drawer-header" {...props} /></P.Content
  >
{:else}
  <DrawerPart bind:ref baseClass={classes} dataSlot="drawer-header" {...props} />
{/if}
