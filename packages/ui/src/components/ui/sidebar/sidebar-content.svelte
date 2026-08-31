<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarContentProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";
  import ScrollArea from "../scroll-area/scroll-area.svelte";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: SidebarContentProps = $props();
</script>

<ScrollArea class="min-h-0 flex-1" fill overscrollContain scrollFade>
  <div
    bind:this={ref}
    class={cn(
      "flex h-full flex-col gap-2 group-data-[collapsible=icon]:overflow-hidden",
      className,
    )}
    data-sidebar="content"
    data-slot="sidebar-content"
    {...props}
  >
    {@render children?.()}
  </div>
</ScrollArea>
