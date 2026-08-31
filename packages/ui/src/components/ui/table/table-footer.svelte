<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  export type TableFooterProps = Omit<SvelteHTMLElements["tfoot"], "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLTableSectionElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  const baseClass =
    "border-t in-data-[variant=card]:border-none bg-transparent not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] font-medium dark:not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)] [&>tr]:last:border-b-0";

  let { children, class: className, ref = $bindable(null), ...props }: TableFooterProps = $props();
</script>

<tfoot bind:this={ref} class={cn(baseClass, className)} data-slot="table-footer" {...props}>
  {@render children?.()}
</tfoot>
