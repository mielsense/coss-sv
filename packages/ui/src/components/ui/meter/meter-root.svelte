<script module lang="ts">
import type { Meter as ShardsMeter } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type MeterRootProps = ComponentProps<typeof ShardsMeter.Root>;
</script>

<script lang="ts">
import { Meter as MeterPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import MeterIndicator from "./meter-indicator.svelte";
import MeterTrack from "./meter-track.svelte";

let { children, class: className, ref = $bindable(null), ...props }: MeterRootProps = $props();
const classes = $derived(cn("flex w-full flex-col gap-2", className));
</script>

<MeterPrimitive.Root bind:ref class={classes} {...props}>
  {#if children}
    {@render children()}
  {:else}
    <MeterTrack><MeterIndicator /></MeterTrack>
  {/if}
</MeterPrimitive.Root>
