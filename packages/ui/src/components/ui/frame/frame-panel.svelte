<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type FramePanelProps = HTMLAttributes<HTMLDivElement> & {
    children?: Snippet;
    ref?: HTMLDivElement | null;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";

  const baseClass =
    "relative rounded-xl border bg-background bg-clip-padding p-5 shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]";

  let { children, class: className, ref = $bindable(null), ...props }: FramePanelProps = $props();
</script>

<div class={cn(baseClass, className)} data-slot="frame-panel" bind:this={ref} {...props}>
  {@render children?.()}
</div>
