<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
export type SidebarMenuSubProps = Omit<HTMLAttributes<HTMLUListElement>, "children" | "class"> & {
  children?: Snippet;
  class?: string;
  ref?: HTMLUListElement | null;
};
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";

let { children, class: className, ref = $bindable(null), ...props }: SidebarMenuSubProps = $props();
</script>
<ul
  bind:this={ref}
  class={cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-sidebar-border border-l px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className)}
  data-sidebar="menu-sub"
  data-slot="sidebar-menu-sub"
  {...props}
>
  {@render children?.()}
</ul>
