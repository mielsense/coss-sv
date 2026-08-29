<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  export type PaginationItemProps = Omit<SvelteHTMLElements["li"], "children"> & {
    children?: Snippet;
    ref?: HTMLLIElement | null;
  };
</script>

<script lang="ts">
  let { children, ref = $bindable(null), ...props }: PaginationItemProps = $props();
</script>

<li bind:this={ref} data-slot="pagination-item" {...props}>
  {@render children?.()}
</li>
