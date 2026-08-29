<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type BreadcrumbNavProps = HTMLAttributes<HTMLElement> & {
    children?: Snippet;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  let { children, ref = $bindable(null), ...props }: BreadcrumbNavProps = $props();
</script>

<nav aria-label="breadcrumb" data-slot="breadcrumb" bind:this={ref} {...props}>
  {@render children?.()}
</nav>
