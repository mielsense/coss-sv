<script module lang="ts">
  import type { Progress as ShardsProgress } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type ProgressRootProps = ComponentProps<typeof ShardsProgress.Root>;
</script>

<script lang="ts">
  import { Progress as ProgressPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";
  import ProgressIndicator from "./progress-indicator.svelte";
  import ProgressTrack from "./progress-track.svelte";

  let {
    children: outerChildren,
    class: className,
    ref = $bindable(null),
    ...props
  }: ProgressRootProps = $props();
  const classes = $derived(cn("flex w-full flex-col gap-2", className));
</script>

<ProgressPrimitive.Root bind:ref data-slot="progress" class={classes} {...props}>
  {#snippet children(state)}
    {#if outerChildren}
      {@render outerChildren(state)}
    {:else}
      <ProgressTrack><ProgressIndicator /></ProgressTrack>
    {/if}
  {/snippet}
</ProgressPrimitive.Root>
