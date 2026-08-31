<script lang="ts">
  import { Drawer as DrawerPrimitive } from "@shardsui/svelte/drawer";
  import { cn } from "@/utils.js";
  import type { DrawerPanelProps } from "./drawer-panel.svelte";
  import DrawerPart from "./drawer-part.svelte";

  let {
    allowSelection = true,
    class: className,
    ref = $bindable(null),
    scrollFade: _scrollFade,
    scrollable: _scrollable,
    ...props
  }: DrawerPanelProps = $props();

  const classes = $derived(
    cn(
      "p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-header])]:pt-1 in-[[data-slot=drawer-popup]:has([data-slot=drawer-footer]:not(.border-t))]:pb-1",
      !allowSelection && "cursor-default",
      className,
    ),
  );
</script>

{#if allowSelection}
  <DrawerPrimitive.Content>
    <DrawerPart bind:ref baseClass={classes} dataSlot="drawer-panel" {...props} />
  </DrawerPrimitive.Content>
{:else}
  <DrawerPart bind:ref baseClass={classes} dataSlot="drawer-panel" {...props} />
{/if}
