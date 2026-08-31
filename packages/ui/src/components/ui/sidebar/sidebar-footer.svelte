<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarFooterProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: SidebarFooterProps = $props();
</script>

<div
  bind:this={ref}
  class={cn("flex flex-col gap-2 p-2", className)}
  data-sidebar="footer"
  data-slot="sidebar-footer"
  {...props}
>
  {@render children?.()}
</div>
