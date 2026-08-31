<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLLabelAttributes } from "svelte/elements";

  export type LabelProps = Omit<HTMLLabelAttributes, "children" | "class"> & {
    as?: keyof HTMLElementTagNameMap;
    children?: Snippet;
    class?: string;
    ref?: HTMLElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  const baseClass =
    "inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4";

  let {
    as = "label",
    children,
    class: className,
    ref = $bindable(null),
    ...props
  }: LabelProps = $props();

  const classes = $derived(cn(baseClass, className));
</script>

<svelte:element this={as} bind:this={ref} data-slot="label" class={classes} {...props}>
  {@render children?.()}
</svelte:element>
