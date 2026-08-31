<script module lang="ts">
  import type { Meter as ShardsMeter } from "@shardsui/svelte/meter";
  import type { ComponentProps } from "svelte";
  export type MeterIndicatorProps = ComponentProps<typeof ShardsMeter.Indicator>;
</script>

<script lang="ts">
  import { Meter as MeterPrimitive } from "@shardsui/svelte/meter";
  import { cn } from "@/utils.js";

  let { class: className, ref = $bindable(null), ...props }: MeterIndicatorProps = $props();
  const classes = $derived(cn("bg-primary transition-all duration-500", className));
</script>

<MeterPrimitive.Indicator bind:ref data-slot="meter-indicator" class={classes} {...props} />
