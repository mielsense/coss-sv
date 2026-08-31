<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type SidebarMenuSkeletonProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "class"
  > & {
    children?: Snippet;
    class?: string;
    ref?: HTMLDivElement | null;
    showIcon?: boolean;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";
  import Skeleton from "../skeleton/skeleton.svelte";

  const uid = $props.id();
  let {
    children,
    class: className,
    ref = $bindable(null),
    showIcon = false,
    ...props
  }: SidebarMenuSkeletonProps = $props();
  const hash = Array.from(uid).reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );
  const width = `${50 + (hash % 40)}%`;
</script>

<div
  bind:this={ref}
  class={cn("flex h-8 items-center gap-2 rounded-lg px-2", className)}
  data-sidebar="menu-skeleton"
  data-slot="sidebar-menu-skeleton"
  {...props}
>
  {#if children}
    {@render children()}
  {:else}
    {#if showIcon}
      <Skeleton class="size-4 rounded-lg" data-sidebar="menu-skeleton-icon" />
    {/if}
    <Skeleton
      class="h-4 max-w-(--skeleton-width) flex-1"
      data-sidebar="menu-skeleton-text"
      style={`--skeleton-width: ${width};`}
    />
  {/if}
</div>
