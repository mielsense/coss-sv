<script module lang="ts">
import type { HTMLAttributes } from "svelte/elements";
export type NumberFieldScrubAreaProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  ref?: HTMLDivElement | null;
};
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";
import { getNumberFieldContext } from "./context.js";
import CursorGrowIcon from "./cursor-grow-icon.svelte";

let {
  class: className,
  label,
  onpointerdown,
  ref = $bindable(null),
  ...props
}: NumberFieldScrubAreaProps = $props();
const context = getNumberFieldContext();
let origin = 0;
let consumed = 0;
let scrubbing = $state(false);
let cursorX = $state(0);
let cursorY = $state(0);
function pointerdown(event: PointerEvent): void {
  if (context.disabled || context.readonly) return;
  onpointerdown?.(event as Parameters<NonNullable<typeof onpointerdown>>[0]);
  if (event.defaultPrevented) return;
  origin = event.clientX;
  consumed = 0;
  scrubbing = true;
  cursorX = event.clientX;
  cursorY = event.clientY;
  const node = event.currentTarget as HTMLDivElement;
  node.setPointerCapture(event.pointerId);
}
function pointermove(event: PointerEvent): void {
  if (!(event.currentTarget as HTMLDivElement).hasPointerCapture(event.pointerId)) return;
  cursorX = event.clientX;
  cursorY = event.clientY;
  const steps = Math.trunc((event.clientX - origin) / 8);
  if (steps !== consumed) {
    context.scrub(steps - consumed);
    consumed = steps;
  }
}
function pointerup(): void {
  scrubbing = false;
}
</script>
<div
  bind:this={ref}
  class={cn("flex cursor-ew-resize", className)}
  data-slot="number-field-scrub-area"
  onpointercancel={pointerup}
  onpointerdown={pointerdown}
  onpointermove={pointermove}
  onpointerup={pointerup}
  {...props}
>
  <label class="cursor-ew-resize" for={context.id}>{label}</label>
  {#if scrubbing}
    <span
      aria-hidden="true"
      class="pointer-events-none fixed z-50 drop-shadow-[0_1px_1px_#0008] filter"
      data-slot="number-field-scrub-area-cursor"
      style={`left:${cursorX}px;top:${cursorY}px;transform:translate(-50%,-50%)`}
      ><CursorGrowIcon /></span
    >
  {/if}
</div>
