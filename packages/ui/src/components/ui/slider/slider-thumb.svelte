<script module lang="ts">
  import type { Slider as ShardsSlider } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type SliderThumbProps = ComponentProps<typeof ShardsSlider.Thumb>;
</script>

<script lang="ts">
  import { Slider as SliderPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";

  let { class: className, ref = $bindable(null), ...props }: SliderThumbProps = $props();

  const classes = $derived(
    cn(
      "block size-5 shrink-0 select-none rounded-full border border-input bg-white not-dark:bg-clip-padding shadow-xs/5 outline-none transition-[box-shadow,scale] before:absolute before:inset-0 before:rounded-full before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:ring-[3px] has-focus-visible:ring-ring/24 data-dragging:scale-120 sm:size-4 dark:border-background dark:has-focus-visible:ring-ring/48 [:has(*:focus-visible),[data-dragging]]:shadow-none",
      className,
    ),
  );
</script>

<SliderPrimitive.Thumb bind:ref data-slot="slider-thumb" class={classes} {...props} />
