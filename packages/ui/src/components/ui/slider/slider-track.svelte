<script module lang="ts">
  import type { Slider as ShardsSlider } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type SliderTrackProps = ComponentProps<typeof ShardsSlider.Track>;
</script>

<script lang="ts">
  import { Slider as SliderPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";

  let { class: className, ref = $bindable(null), ...props }: SliderTrackProps = $props();

  const classes = $derived(
    cn(
      "relative grow select-none before:absolute before:rounded-full before:bg-input data-[orientation=horizontal]:h-1 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1 data-[orientation=horizontal]:before:inset-x-0.5 data-[orientation=vertical]:before:inset-x-0 data-[orientation=horizontal]:before:inset-y-0 data-[orientation=vertical]:before:inset-y-0.5",
      className,
    ),
  );
</script>

<SliderPrimitive.Track bind:ref data-slot="slider-track" class={classes} {...props} />
