<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
export type SidebarGroupLabelProps = Omit<HTMLAttributes<HTMLElement>, "children" | "class"> & {
  as?: keyof HTMLElementTagNameMap;
  children?: Snippet;
  class?: string;
  ref?: HTMLElement | null;
};
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";

let {
  as = "div",
  children,
  class: className,
  ref = $bindable(null),
  ...props
}: SidebarGroupLabelProps = $props();
</script>
<svelte:element
  this={as}
  bind:this={ref}
  class={cn(
    "flex h-8 shrink-0 items-center rounded-lg px-2 font-medium text-sidebar-foreground text-xs outline-hidden ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
    "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
    className,
  )}
  data-sidebar="group-label"
  data-slot="sidebar-group-label"
  {...props}
  >{@render children?.()}</svelte:element
>
