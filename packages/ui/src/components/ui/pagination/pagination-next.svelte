<script module lang="ts">
  import type { PaginationLinkProps } from "./pagination-link.svelte";

  export type PaginationNextProps = PaginationLinkProps;
</script>

<script lang="ts">
  import ChevronRightIcon from "@hugeicons/core-free-icons/ChevronRightIcon";
  import HugeiconsIcon from "@/hugeicons-icon.svelte";
  import { cn } from "@/utils.js";
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
  <HugeiconsIcon aria-hidden="true" class="sm:-me-1" icon={ChevronRightIcon} strokeWidth={2} />
</PaginationLink>
