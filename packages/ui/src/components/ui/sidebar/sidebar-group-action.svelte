<script module lang="ts">
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { SidebarPolymorphicDiscriminator } from "./polymorphic.js";

export type SidebarGroupActionTag = "a" | "button";
export type SidebarGroupActionProps<Tag extends SidebarGroupActionTag = "button"> = Omit<
  SvelteHTMLElements[Tag],
  "children" | "class" | "ref"
> &
  SidebarPolymorphicDiscriminator<SidebarGroupActionTag, Tag, "button"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLElement | null;
  };
type SidebarGroupActionComponentProps =
  | SidebarGroupActionProps<"a">
  | SidebarGroupActionProps<"button">;
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";

let {
  as = "button",
  children,
  class: className,
  ref = $bindable(null),
  ...props
}: SidebarGroupActionComponentProps = $props();

const forwardedProps = $derived({
  ...(as === "button" ? { type: "button" } : {}),
  ...props,
} as Record<string, unknown>);
</script>
<svelte:element
  this={as}
  bind:this={ref}
  class={cn(
    "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-lg p-0 text-sidebar-foreground outline-hidden ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0",
    "after:absolute after:-inset-2 md:after:hidden",
    "group-data-[collapsible=icon]:hidden",
    className,
  )}
  data-sidebar="group-action"
  data-slot="sidebar-group-action"
  {...forwardedProps}
  >{@render children?.()}</svelte:element
>
