<script module lang="ts">
import type { Slider as ShardsSlider } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type SliderValueType = number | readonly number[];
type ShardsSliderRootProps = ComponentProps<typeof ShardsSlider.Root>;

export type SliderRootProps = Omit<ShardsSliderRootProps, "onValueChange" | "value"> & {
  defaultValue?: SliderValueType;
  onValueChange?: (value: SliderValueType) => void;
  value?: SliderValueType;
};
</script>

<script lang="ts">
import { Slider as SliderPrimitive } from "@shardsui/svelte";
import { type Component, tick, untrack } from "svelte";
import { cn } from "$lib/utils.js";
import SliderControl from "./slider-control.svelte";
import SliderIndicator from "./slider-indicator.svelte";
import SliderThumb from "./slider-thumb.svelte";
import SliderTrack from "./slider-track.svelte";

const StyledSliderPrimitiveRoot = SliderPrimitive.Root as Component<
  ShardsSliderRootProps,
  object,
  "ref" | "value"
>;

let {
  children: outerChildren,
  class: className,
  defaultValue,
  max = 100,
  min = 0,
  onValueChange,
  ref = $bindable(null),
  thumbAlignment = "edge",
  value = $bindable(),
  ...props
}: SliderRootProps = $props();

const initialDefaultValue = untrack(() => defaultValue);
const currentValue = $derived(value ?? initialDefaultValue ?? min);
let primitiveValue = $state<SliderValueType>(untrack(() => value ?? initialDefaultValue ?? min));
const thumbCount = $derived(Array.isArray(currentValue) ? currentValue.length : 1);
const classes = $derived(cn("data-[orientation=horizontal]:w-full", className));
const valueChangeProps = $derived(onValueChange ? { onValueChange } : {});

function valuesEqual(left: SliderValueType, right: SliderValueType): boolean {
  if (left === right) return true;
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((entry, index) => entry === right[index])
  );
}

function setPrimitiveValue(next: SliderValueType) {
  primitiveValue = next;
  value = next;

  if (!valuesEqual(currentValue, next)) {
    void tick().then(() => {
      primitiveValue = currentValue;
    });
  }
}

$effect(() => {
  primitiveValue = currentValue;
});
</script>

<StyledSliderPrimitiveRoot
  bind:ref
  bind:value={() => primitiveValue, setPrimitiveValue}
  {min}
  {max}
  {thumbAlignment}
  {...valueChangeProps}
  class={classes}
  {...props}
>
  {#snippet children(state)}
    {@render outerChildren?.(state)}
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        {#each Array(thumbCount) as _, index (index)}
          <SliderThumb {index} />
        {/each}
      </SliderTrack>
    </SliderControl>
  {/snippet}
</StyledSliderPrimitiveRoot>
