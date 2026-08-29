<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type FrameProps = HTMLAttributes<HTMLDivElement> & {
    children?: Snippet;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  const baseClass =
    "relative flex flex-col rounded-2xl bg-muted/72 p-1 *:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1";

  let { children, class: className, ref = $bindable(null), ...props }: FrameProps = $props();
</script>

<div class={cn(baseClass, className)} data-slot="frame" bind:this={ref} {...props}>
  {@render children?.()}
</div>
