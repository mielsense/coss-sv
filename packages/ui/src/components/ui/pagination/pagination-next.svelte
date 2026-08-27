<script module lang="ts">
import type { PaginationLinkProps } from "./pagination-link.svelte";

export type PaginationNextProps = PaginationLinkProps;
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";
import PaginationLink from "./pagination-link.svelte";

let {
  "aria-label": ariaLabel = "Go to next page",
  children: _children,
  class: className,
  ref = $bindable(null),
  size = "default",
  ...props
}: PaginationNextProps = $props();
</script>

<PaginationLink
  aria-label={ariaLabel}
  class={cn("max-sm:aspect-square max-sm:p-0", className)}
  bind:ref
  {size}
  {...props}
>
  <span class="max-sm:hidden">Next</span>
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
    class="lucide lucide-chevron-right sm:-me-1"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6"></path>
  </svg>
</PaginationLink>
