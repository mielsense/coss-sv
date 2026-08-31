<script module lang="ts">
  import type { Progress as ShardsProgress } from "@shardsui/svelte/progress";
  import type { ComponentProps } from "svelte";
  export type ProgressLabelProps = ComponentProps<typeof ShardsProgress.Label>;
</script>

<script lang="ts">
  import { Progress as ProgressPrimitive } from "@shardsui/svelte/progress";
  import { cn } from "@/utils.js";

  let { class: className, ref = $bindable(null), ...props }: ProgressLabelProps = $props();
  const classes = $derived(cn("font-medium text-sm", className));
</script>

<ProgressPrimitive.Label bind:ref data-slot="progress-label" class={classes} {...props} />
