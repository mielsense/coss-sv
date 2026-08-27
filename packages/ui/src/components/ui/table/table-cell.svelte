<script module lang="ts">
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

export type TableCellProps = Omit<SvelteHTMLElements["td"], "children" | "class"> & {
  children?: Snippet;
  class?: string;
  ref?: HTMLTableCellElement | null;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

const baseClass =
  "whitespace-nowrap bg-clip-padding p-2.5 in-data-[slot=table-footer]:py-3.5 align-middle leading-none in-data-[variant=card]:first:ps-[calc(--spacing(2.5)-1px)] in-data-[variant=card]:last:pe-[calc(--spacing(2.5)-1px)] has-[[role=checkbox]]:w-px last:has-[[role=checkbox]]:ps-0 first:has-[[role=checkbox]]:pe-0";

let { children, class: className, ref = $bindable(null), ...props }: TableCellProps = $props();
</script>

<td bind:this={ref} class={cn(baseClass, className)} data-slot="table-cell" {...props}>
  {@render children?.()}
</td>
