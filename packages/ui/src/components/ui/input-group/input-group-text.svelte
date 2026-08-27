<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type InputGroupTextProps = Omit<HTMLAttributes<HTMLSpanElement>, "children" | "class"> & {
  children?: Snippet;
  class?: string;
  ref?: HTMLSpanElement | null;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let { children, class: className, ref = $bindable(null), ...props }: InputGroupTextProps = $props();

const baseClass =
  "flex items-center gap-2 truncate text-muted-foreground in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*='size-'])]:size-4.5 sm:in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5";
</script>

<span bind:this={ref} class={cn(baseClass, className)} {...props}> {@render children?.()} </span>
