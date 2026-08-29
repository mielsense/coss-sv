<script module lang="ts">
  import type { Meter as ShardsMeter } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type MeterIndicatorProps = ComponentProps<typeof ShardsMeter.Indicator>;
</script>

<script lang="ts">
  import { Meter as MeterPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";

  let { class: className, ref = $bindable(null), ...props }: MeterIndicatorProps = $props();
  const classes = $derived(cn("bg-primary transition-all duration-500", className));
</script>

<MeterPrimitive.Indicator bind:ref data-slot="meter-indicator" class={classes} {...props} />
