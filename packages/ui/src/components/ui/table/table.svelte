<script module lang="ts">
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

export type TableVariant = "default" | "card";

export type TableProps = Omit<SvelteHTMLElements["table"], "children" | "class"> & {
  children?: Snippet;
  class?: string;
  containerAs?: keyof HTMLElementTagNameMap;
  containerClass?: string;
  containerId?: string;
  containerRef?: HTMLElement | null;
  containerStyle?: string;
  ref?: HTMLTableElement | null;
  variant?: TableVariant;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let {
  children,
  class: className,
  containerAs = "div",
  containerClass,
  containerId,
  containerRef = $bindable(null),
  containerStyle,
  ref = $bindable(null),
  variant = "default",
  ...props
}: TableProps = $props();

const tableClass = $derived(
  cn(
    "w-full caption-bottom in-data-[variant=card]:border-separate in-data-[variant=card]:border-spacing-0 text-sm",
    className,
  ),
);
</script>

<svelte:element
  this={containerAs}
  bind:this={containerRef}
  class={cn("relative w-full overflow-x-auto", containerClass)}
  data-slot="table-container"
  data-variant={variant}
  id={containerId}
  style={containerStyle}
>
  <table bind:this={ref} class={tableClass} data-slot="table" {...props}>
    {@render children?.()}
  </table>
</svelte:element>
