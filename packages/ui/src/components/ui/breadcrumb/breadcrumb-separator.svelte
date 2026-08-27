<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLLiAttributes } from "svelte/elements";

export type BreadcrumbSeparatorProps = HTMLLiAttributes & {
  children?: Snippet;
  ref?: HTMLLIElement | null;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let {
  children,
  class: className,
  ref = $bindable(null),
  ...props
}: BreadcrumbSeparatorProps = $props();
</script>

<li
  aria-hidden="true"
  class={cn("opacity-80 [&>svg]:size-4", className)}
  data-slot="breadcrumb-separator"
  role="presentation"
  bind:this={ref}
  {...props}
>
  {#if children}
    {@render children()}
  {:else}
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
      class="lucide lucide-chevron-right"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6"></path>
    </svg>
  {/if}
</li>
