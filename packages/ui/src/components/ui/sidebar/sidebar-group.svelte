<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let { children, class: className, ref = $bindable(null), ...props }: SidebarGroupProps = $props();
</script>

<div
  bind:this={ref}
  class={cn("relative flex w-full min-w-0 flex-col p-2", className)}
  data-sidebar="group"
  data-slot="sidebar-group"
  {...props}
>
  {@render children?.()}
</div>
