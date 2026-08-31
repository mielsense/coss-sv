<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  export type SidebarRailProps = Omit<HTMLButtonAttributes, "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLButtonElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";
  import { useSidebar } from "./context.js";

  let {
    children,
    class: className,
    onclick,
    ref = $bindable(null),
    ...props
  }: SidebarRailProps = $props();
  const sidebar = useSidebar();

  function handleClick(event: MouseEvent): void {
    onclick?.(event as MouseEvent & { currentTarget: EventTarget & HTMLButtonElement });
    sidebar.toggleSidebar();
  }
</script>

<button
  bind:this={ref}
  aria-label="Toggle Sidebar"
  class={cn(
    "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
    "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
    "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
    "group-data-[collapsible=offcanvas]:translate-x-0 hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:after:left-full",
    "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
    "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
    className,
  )}
  data-sidebar="rail"
  data-slot="sidebar-rail"
  onclick={handleClick}
  tabindex={-1}
  title="Toggle Sidebar"
  type="button"
  {...props}
>
  {@render children?.()}
</button>
