<script module lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  export type NumberFieldScrubAreaProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
    direction?: "horizontal" | "vertical";
    label: string;
    pixelSensitivity?: number;
    ref?: HTMLSpanElement | null;
    teleportDistance?: number;
  };
</script>

<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { cn } from "@/utils.js";
  import Label from "../label/label.svelte";
  import { getNumberFieldContext } from "./context.js";
  import CursorGrowIcon from "./cursor-grow-icon.svelte";

  let {
    class: className,
    direction = "horizontal",
    label,
    onpointercancel,
    onpointerdown,
    onpointermove,
    onpointerup,
    pixelSensitivity = 2,
    ref = $bindable(null),
    style,
    teleportDistance,
    ...props
  }: NumberFieldScrubAreaProps = $props();
  const context = getNumberFieldContext();
  const labelId = $props.id();
  untrack(() => context.registerScrubLabelId(labelId));
  $effect(() => untrack(() => context.registerScrubLabelId(labelId)));
  let origin = 0;
  let consumed = 0;
  let pointerId: number | undefined;
  let virtualOffset = 0;
  let scrubbing = $state(false);
  let cursorX = $state(0);
  let cursorY = $state(0);
  const cursorClass = $derived(
    direction === "horizontal" ? "cursor-ew-resize" : "cursor-ns-resize",
  );

  function eventAxis(event: PointerEvent): number {
    return direction === "horizontal" ? event.clientX : -event.clientY;
  }

  function updateCursor(event: PointerEvent, delta: number): void {
    const distance = teleportDistance;
    if (!distance || distance <= 0) {
      cursorX = event.clientX;
      cursorY = event.clientY;
      return;
    }
    const span = distance * 2;
    const wrapped = ((((delta + distance) % span) + span) % span) - distance;
    if (direction === "horizontal") cursorX = origin + wrapped;
    else cursorY = -origin - wrapped;
  }

  function finishScrub(event?: PointerEvent, commit = false): void {
    if (!scrubbing) return;
    scrubbing = false;
    pointerId = undefined;
    if (document.pointerLockElement === ref) document.exitPointerLock?.();
    if (commit && event) context.commit(event, "scrub");
  }
  function pointerdown(event: PointerEvent): void {
    if (context.disabled || context.readonly) return;
    onpointerdown?.(event as Parameters<NonNullable<typeof onpointerdown>>[0]);
    if (event.defaultPrevented) return;
    origin = eventAxis(event);
    consumed = 0;
    virtualOffset = 0;
    pointerId = event.pointerId;
    scrubbing = true;
    cursorX = event.clientX;
    cursorY = event.clientY;
    const node = event.currentTarget as HTMLSpanElement;
    if (event.isTrusted) {
      try {
        node.setPointerCapture(event.pointerId);
      } catch {
        // The pointer may already have ended between dispatch and capture.
      }
    }
    context.focusInput();
    if (event.pointerType === "mouse") void node.requestPointerLock?.();
  }
  function pointermove(event: PointerEvent): void {
    onpointermove?.(event as Parameters<NonNullable<typeof onpointermove>>[0]);
    if (event.defaultPrevented) return;
    if (!scrubbing || event.pointerId !== pointerId) return;
    const locked = document.pointerLockElement === ref;
    if (locked) {
      virtualOffset += direction === "horizontal" ? event.movementX : -event.movementY;
    }
    const delta = locked ? virtualOffset : eventAxis(event) - origin;
    updateCursor(event, delta);
    const sensitivity = Math.max(1, pixelSensitivity);
    const steps = Math.trunc(delta / sensitivity);
    if (steps !== consumed) {
      context.scrub(steps - consumed, event);
      consumed = steps;
    }
  }
  function pointerup(event: PointerEvent): void {
    onpointerup?.(event as Parameters<NonNullable<typeof onpointerup>>[0]);
    if (event.defaultPrevented) return;
    finishScrub(event, true);
  }
  function pointercancel(event: PointerEvent): void {
    onpointercancel?.(event as Parameters<NonNullable<typeof onpointercancel>>[0]);
    if (event.defaultPrevented) return;
    finishScrub(event, false);
  }

  onDestroy(() => finishScrub(undefined, false));
</script>

<span
  bind:this={ref}
  class={cn("flex", cursorClass, className)}
  data-slot="number-field-scrub-area"
  role="presentation"
  style={`touch-action: none; -webkit-user-select: none; user-select: none;${style ? ` ${style}` : ""}`}
  onpointercancel={pointercancel}
  onpointerdown={pointerdown}
  onpointermove={pointermove}
  onpointerup={pointerup}
  {...props}
>
  <Label class={cursorClass} for={context.id} id={labelId}>{label}</Label>
  {#if scrubbing}
    <span
      aria-hidden="true"
      class="pointer-events-none fixed z-50 drop-shadow-[0_1px_1px_#0008] filter"
      data-slot="number-field-scrub-area-cursor"
      style={`left:${cursorX}px;top:${cursorY}px;transform:translate(-50%,-50%)`}
      ><CursorGrowIcon /></span
    >
  {/if}
</span>
