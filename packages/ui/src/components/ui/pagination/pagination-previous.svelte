<script module lang="ts">
import type { PaginationLinkProps } from "./pagination-link.svelte";

export type PaginationPreviousProps = PaginationLinkProps;
</script>

<script lang="ts">
import { ChevronLeftIcon } from "@hugeicons/core-free-icons";
import HugeiconsIcon from "$lib/hugeicons-icon.svelte";
import { cn } from "$lib/utils.js";
import PaginationLink from "./pagination-link.svelte";

let {
  "aria-label": ariaLabel = "Go to previous page",
  children: _children,
  class: className,
  ref = $bindable(null),
  size = "default",
  ...props
}: PaginationPreviousProps = $props();
</script>

<PaginationLink
  aria-label={ariaLabel}
  class={cn("max-sm:aspect-square max-sm:p-0", className)}
  bind:ref
  {size}
  {...props}
>
  <HugeiconsIcon aria-hidden="true" class="sm:-ms-1" icon={ChevronLeftIcon} strokeWidth={2} />
  <span class="max-sm:hidden">Previous</span>
</PaginationLink>
