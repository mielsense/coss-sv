<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLLiAttributes } from "svelte/elements";

  export type BreadcrumbItemProps = HTMLLiAttributes & {
    children?: Snippet;
    ref?: HTMLLIElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: BreadcrumbItemProps = $props();
</script>

<li
  class={cn("inline-flex items-center gap-1.5", className)}
  data-slot="breadcrumb-item"
  bind:this={ref}
  {...props}
>
  {@render children?.()}
</li>
