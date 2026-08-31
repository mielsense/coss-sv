<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  export type TableRowProps = Omit<SvelteHTMLElements["tr"], "children" | "class"> & {
    children?: Snippet;
    class?: string;
    ref?: HTMLTableRowElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  const baseClass =
    "relative border-b not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-black)_2%)] not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-black)_4%)] dark:not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-white)_4%)] dark:not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-white)_2%)]";

  let { children, class: className, ref = $bindable(null), ...props }: TableRowProps = $props();
</script>

<tr bind:this={ref} class={cn(baseClass, className)} data-slot="table-row" {...props}>
  {@render children?.()}
</tr>
