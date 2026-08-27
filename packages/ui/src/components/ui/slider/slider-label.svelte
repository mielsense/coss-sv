<script module lang="ts">
import type { Slider as ShardsSlider } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type SliderLabelProps = ComponentProps<typeof ShardsSlider.Label>;
</script>

<script lang="ts">
import { Slider as SliderPrimitive } from "@shardsui/svelte";

let { ref = $bindable(null), ...props }: SliderLabelProps = $props();
</script>

<SliderPrimitive.Label bind:ref data-slot="slider-label" {...props} />
