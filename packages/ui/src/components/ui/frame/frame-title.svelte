<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type FrameTitleProps = HTMLAttributes<HTMLDivElement> & {
  children?: Snippet;
  ref?: HTMLDivElement | null;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let { children, class: className, ref = $bindable(null), ...props }: FrameTitleProps = $props();
</script>

<div
  class={cn("font-semibold text-sm", className)}
  data-slot="frame-panel-title"
  bind:this={ref}
  {...props}
>
  {@render children?.()}
</div>
