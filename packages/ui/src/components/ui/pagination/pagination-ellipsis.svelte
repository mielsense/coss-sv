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
  import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
  import HugeiconsIcon from "$lib/hugeicons-icon.svelte";
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
  <HugeiconsIcon
    aria-hidden="true"
    class="size-5 sm:size-4"
    icon={MoreHorizontalIcon}
    strokeWidth={2}
  />
  <span class="sr-only">More pages</span>
</span>
