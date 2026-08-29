<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement> & {
    children?: Snippet;
    ref?: HTMLSpanElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: BreadcrumbPageProps = $props();
</script>

<span
  aria-current="page"
  class={cn("font-normal text-foreground", className)}
  data-slot="breadcrumb-page"
  bind:this={ref}
  {...props}
>
  {@render children?.()}
</span>
