<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  export type EmptyProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
    children?: Snippet;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";

  type Props = EmptyProps & { baseClass: string; dataSlot: string };
  let {
    baseClass,
    children,
    class: className,
    dataSlot,
    ref = $bindable(null),
    ...props
  }: Props = $props();
</script>

<div bind:this={ref} class={cn(baseClass, className)} data-slot={dataSlot} {...props}>
  {@render children?.()}
</div>
