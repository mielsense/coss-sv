<script module lang="ts">
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

export type TableHeaderProps = Omit<SvelteHTMLElements["thead"], "children" | "class"> & {
  children?: Snippet;
  class?: string;
  ref?: HTMLTableSectionElement | null;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let { children, class: className, ref = $bindable(null), ...props }: TableHeaderProps = $props();
</script>

<thead bind:this={ref} class={cn("[&_tr]:border-b", className)} data-slot="table-header" {...props}>
  {@render children?.()}
</thead>
