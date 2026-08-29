<script module lang="ts">
  import type { Progress as ShardsProgress } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type ProgressValueProps = ComponentProps<typeof ShardsProgress.Value>;
</script>

<script lang="ts">
  import { Progress as ProgressPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";

  let { class: className, ref = $bindable(null), ...props }: ProgressValueProps = $props();
  const classes = $derived(cn("text-sm tabular-nums", className));
</script>

<ProgressPrimitive.Value bind:ref data-slot="progress-value" class={classes} {...props} />
