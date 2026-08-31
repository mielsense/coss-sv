<script module lang="ts">
  import type { ContextMenu as ShardsContextMenu } from "@shardsui/svelte/context-menu";
  import type { ComponentProps } from "svelte";
  export type ContextMenuLinkItemProps = ComponentProps<typeof ShardsContextMenu.LinkItem> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  };
</script>

<script lang="ts">
  import { ContextMenu as P } from "@shardsui/svelte/context-menu";
  import { cn } from "@/utils.js";

  const itemClass =
    "flex min-h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-inset:ps-8 data-[variant=destructive]:text-destructive-foreground data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none [&>svg]:-mx-0.5 [&>svg]:shrink-0";
  let {
    class: className,
    closeOnClick = true,
    inset,
    ref = $bindable(null),
    variant = "default",
    ...props
  }: ContextMenuLinkItemProps = $props();
</script>

<P.LinkItem
  bind:ref
  class={cn(itemClass, className)}
  {closeOnClick}
  data-inset={inset}
  data-slot="context-menu-link-item"
  data-variant={variant}
  {...props}
/>
