<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarMenuProps = Omit<HTMLAttributes<HTMLUListElement>, "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLUListElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  let { children, class: className, ref = $bindable(null), ...props }: SidebarMenuProps = $props();
</script>

<ul
  bind:this={ref}
  class={cn("flex w-full min-w-0 flex-col gap-1", className)}
  data-sidebar="menu"
  data-slot="sidebar-menu"
  {...props}
>
  {@render children?.()}
</ul>
