<script module lang="ts">
  import type { Meter as ShardsMeter } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type MeterTrackProps = ComponentProps<typeof ShardsMeter.Track>;
</script>

<script lang="ts">
  import { Meter as MeterPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";

  let { class: className, ref = $bindable(null), ...props }: MeterTrackProps = $props();
  const classes = $derived(cn("block h-2 w-full overflow-hidden bg-input", className));
</script>

<MeterPrimitive.Track bind:ref data-slot="meter-track" class={classes} {...props} />
