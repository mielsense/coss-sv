<script module lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  export type NumberFieldStepButtonProps = Omit<
    HTMLButtonAttributes,
    "children" | "disabled" | "type"
  > & {
    direction: -1 | 1;
    ref?: HTMLButtonElement | null;
  };
</script>

<script lang="ts">
  import MinusSignIcon from "@hugeicons/core-free-icons/MinusSignIcon";
  import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
  import { Button as ButtonPrimitive } from "@shardsui/svelte/button";
  import { onDestroy, type Component } from "svelte";
  import HugeiconsIcon from "@/hugeicons-icon.svelte";
  import { cn } from "@/utils.js";
  import { getNumberFieldContext } from "./context.js";

  const StepButton = ButtonPrimitive as unknown as Component<
    Record<string, unknown>,
    object,
    "ref"
  >;

  let {
    class: className,
    direction,
    onclick,
    onlostpointercapture,
    onpointercancel,
    onpointerdown,
    onpointerup,
    ref = $bindable(null),
    ...props
  }: NumberFieldStepButtonProps = $props();
  const context = getNumberFieldContext();
  const increment = $derived(direction === 1);
  let startTimer: ReturnType<typeof setTimeout> | undefined;
  let repeatTimer: ReturnType<typeof setInterval> | undefined;
  let repeated = false;
  let suppressClick = false;

  function stopRepeat(): void {
    if (startTimer !== undefined) clearTimeout(startTimer);
    if (repeatTimer !== undefined) clearInterval(repeatTimer);
    startTimer = undefined;
    repeatTimer = undefined;
  }

  function handlePointerDown(event: PointerEvent): void {
    onpointerdown?.(event as Parameters<NonNullable<typeof onpointerdown>>[0]);
    if (event.defaultPrevented || (event.button !== 0 && event.pointerType === "mouse")) return;
    stopRepeat();
    repeated = false;
    context.focusInput();
    if (event.isTrusted) {
      try {
        (event.currentTarget as HTMLButtonElement).setPointerCapture?.(event.pointerId);
      } catch {
        // The pointer may already have ended between dispatch and capture.
      }
    }
    startTimer = setTimeout(() => {
      repeated = context.stepBy(
        direction,
        event,
        direction === 1 ? "increment-press" : "decrement-press",
        false,
      );
      repeatTimer = setInterval(() => {
        repeated =
          context.stepBy(
            direction,
            event,
            direction === 1 ? "increment-press" : "decrement-press",
            false,
          ) || repeated;
      }, 60);
    }, 400);
  }

  function finishRepeat(event: PointerEvent, commit: boolean): void {
    stopRepeat();
    if (commit && repeated) {
      context.commitStep(event, direction === 1 ? "increment-press" : "decrement-press");
      suppressClick = true;
    }
    repeated = false;
  }

  function handlePointerUp(event: PointerEvent): void {
    onpointerup?.(event as Parameters<NonNullable<typeof onpointerup>>[0]);
    finishRepeat(event, !event.defaultPrevented);
  }

  function handlePointerCancel(event: PointerEvent): void {
    onpointercancel?.(event as Parameters<NonNullable<typeof onpointercancel>>[0]);
    finishRepeat(event, false);
  }

  function handleLostPointerCapture(event: PointerEvent): void {
    onlostpointercapture?.(event as Parameters<NonNullable<typeof onlostpointercapture>>[0]);
    if (startTimer !== undefined || repeatTimer !== undefined) finishRepeat(event, false);
  }

  function handleClick(event: MouseEvent): void {
    onclick?.(event as Parameters<NonNullable<typeof onclick>>[0]);
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (!event.defaultPrevented) {
      context.stepBy(direction, event, direction === 1 ? "increment-press" : "decrement-press");
    }
  }

  onDestroy(stopRepeat);
</script>

<StepButton
  as="button"
  bind:ref
  aria-controls={context.id}
  aria-label={increment ? "Increase" : "Decrease"}
  class={cn(
    "relative flex shrink-0 cursor-pointer items-center justify-center in-data-[size=sm]:px-[calc(--spacing(2.5)-1px)] px-[calc(--spacing(3)-1px)] transition-colors pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:bg-accent",
    increment ? "rounded-e-[calc(var(--radius-lg)-1px)]" : "rounded-s-[calc(var(--radius-lg)-1px)]",
    className,
  )}
  data-slot={increment ? "number-field-increment" : "number-field-decrement"}
  disabled={increment ? !context.canIncrement : !context.canDecrement}
  onclick={handleClick}
  onlostpointercapture={handleLostPointerCapture}
  onpointercancel={handlePointerCancel}
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
  tabindex={-1}
  type="button"
  {...props}
>
  <HugeiconsIcon
    aria-hidden="true"
    icon={increment ? PlusSignIcon : MinusSignIcon}
    strokeWidth={2}
  />
</StepButton>
