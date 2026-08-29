<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  export type CardProps = Omit<SvelteHTMLElements["div"], "children"> & {
    as?: keyof HTMLElementTagNameMap;
    children?: Snippet;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  type Props = CardProps & { baseClass: string; dataSlot: string };
  let {
    as = "div",
    baseClass,
    children,
    class: className,
    dataSlot,
    ref = $bindable(null),
    ...props
  }: Props = $props();
</script>

<svelte:element
  this={as}
  bind:this={ref}
  class={cn(baseClass, className)}
  data-slot={dataSlot}
  {...props}
>
  {@render children?.()}
</svelte:element>
