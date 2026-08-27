<script module lang="ts">
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

export type PaginationProps = Omit<SvelteHTMLElements["nav"], "children" | "class"> & {
  children?: Snippet;
  class?: string;
  ref?: HTMLElement | null;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let {
  "aria-label": ariaLabel = "pagination",
  children,
  class: className,
  ref = $bindable(null),
  ...props
}: PaginationProps = $props();
</script>

<nav
  aria-label={ariaLabel}
  bind:this={ref}
  class={cn("mx-auto flex w-full justify-center", className)}
  data-slot="pagination"
  {...props}
>
  {@render children?.()}
</nav>
