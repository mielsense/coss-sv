<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  export type TableHeadProps = Omit<SvelteHTMLElements["th"], "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLTableCellElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  const baseClass =
    "h-10 whitespace-nowrap px-2.5 text-left align-middle font-medium text-muted-foreground leading-none has-[[role=checkbox]]:w-px last:has-[[role=checkbox]]:ps-0 first:has-[[role=checkbox]]:pe-0";

  let { children, class: className, ref = $bindable(null), ...props }: TableHeadProps = $props();
</script>

<th bind:this={ref} class={cn(baseClass, className)} data-slot="table-head" {...props}>
  {@render children?.()}
</th>
