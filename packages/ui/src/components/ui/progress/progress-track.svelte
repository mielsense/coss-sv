<script module lang="ts">
  import type { Progress as ShardsProgress } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type ProgressTrackProps = ComponentProps<typeof ShardsProgress.Track>;
</script>

<script lang="ts">
  import { Progress as ProgressPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";

  let { class: className, ref = $bindable(null), ...props }: ProgressTrackProps = $props();
  const classes = $derived(
    cn("block h-1.5 w-full overflow-hidden rounded-full bg-input", className),
  );
</script>

<ProgressPrimitive.Track bind:ref data-slot="progress-track" class={classes} {...props} />
