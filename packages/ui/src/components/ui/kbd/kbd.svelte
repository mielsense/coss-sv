<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type KbdProps = HTMLAttributes<HTMLElement> & {
  children?: Snippet;
  ref?: HTMLElement | null;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

const baseClass =
  "pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded-[.25rem] bg-muted px-1 font-medium font-sans text-muted-foreground text-xs [&_svg:not([class*='size-'])]:size-3";

let { children, class: className, ref = $bindable(null), ...props }: KbdProps = $props();
</script>

<kbd class={cn(baseClass, className)} data-slot="kbd" bind:this={ref} {...props}>
  {@render children?.()}
</kbd>
