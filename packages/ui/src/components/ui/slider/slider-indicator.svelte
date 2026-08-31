<script module lang="ts">
  import type { Slider as ShardsSlider } from "@shardsui/svelte/slider";
  import type { ComponentProps } from "svelte";
  export type SliderIndicatorProps = ComponentProps<typeof ShardsSlider.Indicator>;
</script>

<script lang="ts">
  import { Slider as SliderPrimitive } from "@shardsui/svelte/slider";
  import { cn } from "@/utils.js";

  let { class: className, ref = $bindable(null), ...props }: SliderIndicatorProps = $props();

  const classes = $derived(
    cn(
      "select-none rounded-full bg-primary data-[orientation=horizontal]:ms-0.5 data-[orientation=vertical]:mb-0.5",
      className,
    ),
  );
</script>

<SliderPrimitive.Indicator bind:ref data-slot="slider-indicator" class={classes} {...props} />
