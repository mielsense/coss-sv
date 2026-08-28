<script module lang="ts">
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { SidebarPolymorphicDiscriminator } from "./polymorphic.js";

export type SidebarMenuSubButtonTag = "a" | "button";
export type SidebarMenuSubButtonProps<Tag extends SidebarMenuSubButtonTag = "a"> = Omit<
  SvelteHTMLElements[Tag],
  "children" | "class" | "ref" | "size"
> &
  SidebarPolymorphicDiscriminator<SidebarMenuSubButtonTag, Tag, "a"> & {
    children?: Snippet;
    class?: string;
    isActive?: boolean;
    ref?: HTMLElement | null;
    size?: "md" | "sm";
  };
type SidebarMenuSubButtonComponentProps =
  | SidebarMenuSubButtonProps<"a">
  | SidebarMenuSubButtonProps<"button">;
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";

let {
  as = "a",
  children,
  class: className,
  isActive = false,
  ref = $bindable(null),
  size = "md",
  ...props
}: SidebarMenuSubButtonComponentProps = $props();

const forwardedProps = $derived({
  ...(as === "button" ? { type: "button" } : {}),
  ...props,
} as Record<string, unknown>);
</script>
<svelte:element
  this={as}
  bind:this={ref}
  class={cn(
    "flex h-8 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-lg px-2 text-sidebar-foreground outline-hidden ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 sm:h-7 [&>span:last-child]:truncate [&>svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
    "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
    size === "sm" && "text-xs",
    size === "md" && "text-sm",
    "group-data-[collapsible=icon]:hidden",
    className,
  )}
  data-active={isActive}
  data-sidebar="menu-sub-button"
  data-size={size}
  data-slot="sidebar-menu-sub-button"
  {...forwardedProps}
  >{@render children?.()}</svelte:element
>
