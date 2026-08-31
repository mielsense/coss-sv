<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
    children?: Snippet;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  const baseClass =
    "animate-skeleton rounded-sm [--skeleton-highlight:--alpha(var(--color-white)/64%)] [background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_var(--color-muted)_0_0/200%_100%_fixed] dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)]";

  let { children, class: className, ref = $bindable(null), ...props }: SkeletonProps = $props();
</script>

<div class={cn(baseClass, className)} data-slot="skeleton" bind:this={ref} {...props}>
  {@render children?.()}
</div>
