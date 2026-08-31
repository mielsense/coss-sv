<script module lang="ts">
  import type { Meter as ShardsMeter } from "@shardsui/svelte/meter";
  import type { ComponentProps } from "svelte";
  export type MeterLabelProps = ComponentProps<typeof ShardsMeter.Label>;
</script>

<script lang="ts">
  import { Meter as MeterPrimitive } from "@shardsui/svelte/meter";
  import { cn } from "@/utils.js";

  let { class: className, ref = $bindable(null), ...props }: MeterLabelProps = $props();
  const classes = $derived(cn("font-medium text-foreground text-sm", className));
</script>

<MeterPrimitive.Label bind:ref data-slot="meter-label" class={classes} {...props} />
