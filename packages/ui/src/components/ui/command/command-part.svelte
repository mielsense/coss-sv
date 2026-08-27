<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
export type CommandPartProps = Omit<HTMLAttributes<HTMLElement>, "class"> & {
  as?: "div" | "kbd";
  children?: Snippet;
  class?: string | null;
  ref?: HTMLElement | null;
};
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";
let {
  as = "div",
  baseClass,
  children,
  class: className,
  dataSlot,
  ref = $bindable(null),
  ...props
}: CommandPartProps & { baseClass: string; dataSlot: string } = $props();
</script>
<svelte:element
  this={as}
  bind:this={ref}
  class={cn(baseClass,className)}
  data-slot={dataSlot}
  {...props}
  >{@render children?.()}</svelte:element
>
