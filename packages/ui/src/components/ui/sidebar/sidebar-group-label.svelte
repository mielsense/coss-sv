<script module lang="ts">
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { SidebarPolymorphicDiscriminator } from "./polymorphic.js";

export type SidebarGroupLabelTag = "div" | "label" | "span";
export type SidebarGroupLabelProps<Tag extends SidebarGroupLabelTag = "div"> = Omit<
  SvelteHTMLElements[Tag],
  "children" | "class" | "ref"
> &
  SidebarPolymorphicDiscriminator<SidebarGroupLabelTag, Tag, "div"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLElement | null;
  };
type SidebarGroupLabelComponentProps =
  | SidebarGroupLabelProps<"div">
  | SidebarGroupLabelProps<"label">
  | SidebarGroupLabelProps<"span">;
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";

let {
  as = "div",
  children,
  class: className,
  ref = $bindable(null),
  ...props
}: SidebarGroupLabelComponentProps = $props();

const forwardedProps = $derived(props as Record<string, unknown>);
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
  {...forwardedProps}
  >{@render children?.()}</svelte:element
>
