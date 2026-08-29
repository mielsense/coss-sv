<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarHeaderProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: SidebarHeaderProps = $props();
</script>

<div
  bind:this={ref}
  class={cn("flex flex-col gap-2 p-2", className)}
  data-sidebar="header"
  data-slot="sidebar-header"
  {...props}
>
  {@render children?.()}
</div>
