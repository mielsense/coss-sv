<script module lang="ts">
  import type { Meter as ShardsMeter } from "@shardsui/svelte/meter";
  import type { ComponentProps } from "svelte";
  export type MeterValueProps = ComponentProps<typeof ShardsMeter.Value>;
</script>

<script lang="ts">
  import { Meter as MeterPrimitive } from "@shardsui/svelte/meter";
  import { cn } from "@/utils.js";

  let { class: className, ref = $bindable(null), ...props }: MeterValueProps = $props();
  const classes = $derived(cn("text-foreground text-sm tabular-nums", className));
</script>

<MeterPrimitive.Value bind:ref data-slot="meter-value" class={classes} {...props} />
