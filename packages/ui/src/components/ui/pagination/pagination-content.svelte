<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  export type PaginationContentProps = Omit<SvelteHTMLElements["ul"], "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLUListElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: PaginationContentProps = $props();
</script>

<ul
  bind:this={ref}
  class={cn("flex flex-row items-center gap-1", className)}
  data-slot="pagination-content"
  {...props}
>
  {@render children?.()}
</ul>
