<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarMenuBadgeProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: SidebarMenuBadgeProps = $props();
</script>

<div
  bind:this={ref}
  class={cn(
    "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-lg px-1 font-medium text-sidebar-foreground text-xs tabular-nums",
    "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
    "peer-data-[size=sm]/menu-button:top-1",
    "peer-data-[size=default]/menu-button:top-1.5",
    "peer-data-[size=lg]/menu-button:top-2.5",
    "group-data-[collapsible=icon]:hidden",
    className,
  )}
  data-sidebar="menu-badge"
  data-slot="sidebar-menu-badge"
  {...props}
>
  {@render children?.()}
</div>
