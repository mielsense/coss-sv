<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarGroupContentProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "class"
  > & { children?: Snippet; class?: string; ref?: HTMLDivElement | null };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: SidebarGroupContentProps = $props();
</script>

<div
  bind:this={ref}
  class={cn("w-full text-sm", className)}
  data-sidebar="group-content"
  data-slot="sidebar-group-content"
  {...props}
>
  {@render children?.()}
</div>
