<script module lang="ts">
  import type { Slider as ShardsSlider } from "@shardsui/svelte/slider";
  import type { ComponentProps } from "svelte";
  export type SliderValueProps = ComponentProps<typeof ShardsSlider.Value>;
</script>

<script lang="ts">
  import { Slider as SliderPrimitive } from "@shardsui/svelte/slider";
  import { cn } from "@/utils.js";

  let { class: className, ref = $bindable(null), ...props }: SliderValueProps = $props();
  const classes = $derived(cn("flex justify-end text-sm", className));
</script>

<SliderPrimitive.Value bind:ref data-slot="slider-value" class={classes} {...props} />
