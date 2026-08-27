<script module lang="ts">
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

export type PaginationEllipsisProps = Omit<SvelteHTMLElements["span"], "children" | "class"> & {
  children?: Snippet;
  class?: string;
  ref?: HTMLSpanElement | null;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let {
  children: _children,
  class: className,
  ref = $bindable(null),
  ...props
}: PaginationEllipsisProps = $props();
</script>

<span
  aria-hidden="true"
  bind:this={ref}
  class={cn("flex min-w-7 justify-center", className)}
  data-slot="pagination-ellipsis"
  {...props}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-ellipsis size-5 sm:size-4"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
  <span class="sr-only">More pages</span>
</span>
