<script module lang="ts">
  import type { Slider as ShardsSlider } from "@shardsui/svelte/slider";
  import type { ComponentProps } from "svelte";
  export type SliderControlProps = ComponentProps<typeof ShardsSlider.Control>;
</script>

<script lang="ts">
  import { Slider as SliderPrimitive } from "@shardsui/svelte/slider";
  import { cn } from "@/utils.js";

  let { class: className, ref = $bindable(null), ...props }: SliderControlProps = $props();

  const classes = $derived(
    cn(
      "flex touch-none select-none data-disabled:pointer-events-none data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:min-w-44 data-[orientation=vertical]:flex-col data-disabled:opacity-64",
      className,
    ),
  );
</script>

<SliderPrimitive.Control bind:ref data-slot="slider-control" class={classes} {...props} />
