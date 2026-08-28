<script module lang="ts">
import type { SVGAttributes } from "svelte/elements";
export type CursorGrowIconProps = SVGAttributes<SVGSVGElement>;
</script>
<script lang="ts">
import { ArrowHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import type { ComponentProps } from "svelte";
import { tick } from "svelte";
import { createAttachmentKey } from "svelte/attachments";

let {
  class: className,
  height = 14,
  stroke = "white",
  width = 26,
  ...props
}: CursorGrowIconProps = $props();

let ref: SVGSVGElement | null = $state(null);
const forwardedProps = $derived(props as unknown as ComponentProps<typeof HugeiconsIcon>);
const normalizedClass = $derived(typeof className === "string" ? className : "");
const normalizedHeight = $derived(height ?? 14);
const normalizedStroke = $derived(typeof stroke === "string" ? stroke : "white");
const normalizedWidth = $derived(width ?? 26);
const refAttachment = {
  [createAttachmentKey()]: (node: SVGSVGElement) => {
    ref = node;
    return () => {
      ref = null;
    };
  },
};

$effect(() => {
  normalizedWidth;
  normalizedHeight;
  void tick().then(() => {
    ref?.setAttribute("width", String(normalizedWidth));
    ref?.setAttribute("height", String(normalizedHeight));
  });
});
</script>

<HugeiconsIcon
  {...forwardedProps}
  aria-hidden="true"
  class={normalizedClass}
  color={normalizedStroke}
  height={normalizedHeight}
  icon={ArrowHorizontalIcon}
  size={24}
  strokeWidth={2}
  width={normalizedWidth}
  {...refAttachment}
/>
