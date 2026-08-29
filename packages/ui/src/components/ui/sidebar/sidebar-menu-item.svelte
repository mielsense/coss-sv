<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarMenuItemProps = Omit<HTMLAttributes<HTMLLIElement>, "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLLIElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: SidebarMenuItemProps = $props();
</script>

<li
  bind:this={ref}
  class={cn("group/menu-item relative", className)}
  data-sidebar="menu-item"
  data-slot="sidebar-menu-item"
  {...props}
>
  {@render children?.()}
</li>
