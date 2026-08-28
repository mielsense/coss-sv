<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
export type SidebarMenuActionProps = Omit<HTMLButtonAttributes, "children" | "class"> & {
  as?: keyof HTMLElementTagNameMap;
  children?: Snippet;
  class?: string;
  ref?: HTMLElement | null;
  showOnHover?: boolean;
};
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";

let {
  as = "button",
  children,
  class: className,
  ref = $bindable(null),
  showOnHover = false,
  type = "button",
  ...props
}: SidebarMenuActionProps = $props();
</script>
<svelte:element
  this={as}
  bind:this={ref}
  class={cn(
    "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-lg p-0 text-sidebar-foreground outline-hidden ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0",
    "after:absolute after:-inset-2 md:after:hidden",
    "peer-data-[size=sm]/menu-button:top-1",
    "peer-data-[size=default]/menu-button:top-1.5",
    "peer-data-[size=lg]/menu-button:top-2.5",
    "group-data-[collapsible=icon]:hidden",
    showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
    className,
  )}
  data-sidebar="menu-action"
  data-slot="sidebar-menu-action"
  type={as === "button" ? type : undefined}
  {...props}
  >{@render children?.()}</svelte:element
>
