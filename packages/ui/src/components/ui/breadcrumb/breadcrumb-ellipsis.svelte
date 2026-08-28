<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement> & {
  children?: Snippet;
  ref?: HTMLSpanElement | null;
};
</script>

<script lang="ts">
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import HugeiconsIcon from "$lib/hugeicons-icon.svelte";

let { children: _children, ref = $bindable(null), ...props }: BreadcrumbEllipsisProps = $props();
</script>

<span
  aria-hidden="true"
  data-slot="breadcrumb-ellipsis"
  role="presentation"
  bind:this={ref}
  {...props}
>
  <HugeiconsIcon aria-hidden="true" class="size-4" icon={MoreHorizontalIcon} strokeWidth={2} />
  <span class="sr-only">More</span>
</span>
