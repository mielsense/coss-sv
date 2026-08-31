import { Slider as SliderPrimitive } from "@shardsui/svelte/slider";

export type { SliderControlProps } from "./slider-control.svelte";
export { default as Control } from "./slider-control.svelte";
export type { SliderIndicatorProps } from "./slider-indicator.svelte";
export { default as Indicator } from "./slider-indicator.svelte";
export type { SliderLabelProps } from "./slider-label.svelte";
export { default as Label } from "./slider-label.svelte";
export type {
  SliderChangeEventDetails,
  SliderChangeEventReason,
  SliderCommitEventDetails,
  SliderRootProps,
  SliderValueType,
} from "./slider-root.svelte";
export {
  default as Root,
  default as Slider,
  default as SliderRoot,
} from "./slider-root.svelte";
export type { SliderThumbProps } from "./slider-thumb.svelte";
export { default as Thumb } from "./slider-thumb.svelte";
export type { SliderTrackProps } from "./slider-track.svelte";
export { default as Track } from "./slider-track.svelte";
export type { SliderValueProps } from "./slider-value.svelte";
export {
  default as SliderValue,
  default as Value,
} from "./slider-value.svelte";

export { SliderPrimitive };
