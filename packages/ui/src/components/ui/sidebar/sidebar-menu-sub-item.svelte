<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarMenuSubItemProps = Omit<
    HTMLAttributes<HTMLLIElement>,
    "children" | "class"
  > & {
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
  }: SidebarMenuSubItemProps = $props();
</script>

<li
  bind:this={ref}
  class={cn("group/menu-sub-item relative", className)}
  data-sidebar="menu-sub-item"
  data-slot="sidebar-menu-sub-item"
  {...props}
>
  {@render children?.()}
</li>
