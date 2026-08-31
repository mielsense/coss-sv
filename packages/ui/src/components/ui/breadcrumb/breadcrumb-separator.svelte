<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLLiAttributes } from "svelte/elements";

  export type BreadcrumbSeparatorProps = HTMLLiAttributes & {
    children?: Snippet;
    ref?: HTMLLIElement | null;
  };
</script>

<script lang="ts">
  import ChevronRightIcon from "@hugeicons/core-free-icons/ChevronRightIcon";
  import HugeiconsIcon from "@/hugeicons-icon.svelte";
  import { cn } from "@/utils.js";

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
    <HugeiconsIcon aria-hidden="true" icon={ChevronRightIcon} strokeWidth={2} />
  {/if}
</li>
