<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement> & {
  children?: Snippet;
  ref?: HTMLSpanElement | null;
};
</script>

<script lang="ts">
let { children: _children, ref = $bindable(null), ...props }: BreadcrumbEllipsisProps = $props();
</script>

<span
  aria-hidden="true"
  data-slot="breadcrumb-ellipsis"
  role="presentation"
  bind:this={ref}
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
    class="lucide lucide-ellipsis size-4"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
  <span class="sr-only">More</span>
</span>
