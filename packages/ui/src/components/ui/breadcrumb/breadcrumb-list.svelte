<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLOlAttributes } from "svelte/elements";

  export type BreadcrumbListProps = HTMLOlAttributes & {
    children?: Snippet;
    ref?: HTMLOListElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  const baseClass =
    "wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm sm:gap-2.5";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: BreadcrumbListProps = $props();
</script>

<ol class={cn(baseClass, className)} data-slot="breadcrumb-list" bind:this={ref} {...props}>
  {@render children?.()}
</ol>
