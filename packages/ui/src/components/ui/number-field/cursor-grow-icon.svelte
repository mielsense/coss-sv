<script module lang="ts">
  import type { SVGAttributes } from "svelte/elements";
  export type CursorGrowIconProps = SVGAttributes<SVGSVGElement> & {
    ref?: SVGSVGElement | null;
  };
</script>

<script lang="ts">
  import { ArrowHorizontalIcon } from "@hugeicons/core-free-icons";
  import HugeiconsIcon from "$lib/hugeicons-icon.svelte";
  import { cn } from "$lib/utils.js";

  let {
    class: className,
    fill = "black",
    height = 14,
    ref = $bindable(null),
    stroke = "white",
    width = 26,
    ...props
  }: CursorGrowIconProps = $props();
</script>

<HugeiconsIcon
  {...props}
  aria-hidden="true"
  bind:ref
  class={cn(className)}
  {fill}
  {height}
  icon={ArrowHorizontalIcon}
  size={24}
  {stroke}
  strokeWidth={2}
  {width}
/>
