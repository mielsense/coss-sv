<script module lang="ts">
import type { Snippet } from "svelte";
import type { SVGAttributes } from "svelte/elements";

export type SpinnerProps = Omit<SVGAttributes<SVGSVGElement>, "children" | "height" | "width"> & {
  absoluteStrokeWidth?: boolean;
  children?: Snippet;
  height?: number | string;
  ref?: SVGSVGElement | null;
  size?: number | string;
  strokeWidth?: number | string;
  width?: number | string;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let {
  absoluteStrokeWidth = false,
  "aria-label": ariaLabel = "Loading",
  children,
  class: className,
  size = 24,
  height = size,
  ref = $bindable(null),
  role = "status",
  strokeWidth = 2,
  viewBox = "0 0 24 24",
  width = size,
  ...props
}: SpinnerProps = $props();

const classes = $derived(cn("lucide lucide-loader-circle animate-spin", className));
const computedStrokeWidth = $derived(
  absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
);
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {width}
  {height}
  {viewBox}
  fill="none"
  stroke="currentColor"
  stroke-width={computedStrokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={classes}
  aria-label={ariaLabel}
  {role}
  bind:this={ref}
  {...props}
>
  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  {@render children?.()}
</svg>
