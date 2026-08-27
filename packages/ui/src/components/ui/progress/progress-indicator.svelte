<script module lang="ts">
import type { Progress as ShardsProgress } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ProgressIndicatorProps = ComponentProps<typeof ShardsProgress.Indicator>;
</script>
<script lang="ts">
import { Progress as ProgressPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: ProgressIndicatorProps = $props();
const classes = $derived(cn("bg-primary transition-all duration-500", className));
</script>
<ProgressPrimitive.Indicator bind:ref data-slot="progress-indicator" class={classes} {...props} />
