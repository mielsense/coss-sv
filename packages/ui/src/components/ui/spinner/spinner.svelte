<script module lang="ts">
import type { SVGAttributes } from "svelte/elements";

export type SpinnerProps = Omit<SVGAttributes<SVGSVGElement>, "children" | "height" | "width"> & {
  absoluteStrokeWidth?: boolean;
  height?: number | string;
  ref?: SVGSVGElement | null;
  size?: number | string;
  strokeWidth?: number | string;
  width?: number | string;
};
</script>

<script lang="ts">
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import type { ComponentProps } from "svelte";
import { tick } from "svelte";
import { createAttachmentKey } from "svelte/attachments";
import { cn } from "$lib/utils.js";

let {
  absoluteStrokeWidth = false,
  "aria-label": ariaLabel = "Loading",
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

const classes = $derived(cn("animate-spin", className));
const computedStrokeWidth = $derived(
  absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
);
const forwardedProps = $derived(props as unknown as ComponentProps<typeof HugeiconsIcon>);
const refAttachment = {
  [createAttachmentKey()]: (node: SVGSVGElement) => {
    ref = node;
    return () => {
      ref = null;
    };
  },
};

$effect(() => {
  width;
  height;
  computedStrokeWidth;
  void tick().then(() => {
    ref?.setAttribute("width", String(width));
    ref?.setAttribute("height", String(height));
    ref?.setAttribute("stroke-width", String(computedStrokeWidth));
  });
});
</script>

<HugeiconsIcon
  {...forwardedProps}
  aria-label={ariaLabel}
  class={classes}
  {height}
  icon={Loading03Icon}
  {role}
  {size}
  strokeWidth={Number(computedStrokeWidth)}
  {viewBox}
  {width}
  {...refAttachment}
/>
