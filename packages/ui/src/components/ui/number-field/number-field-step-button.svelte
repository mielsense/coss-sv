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
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button as ButtonPrimitive } from "@shardsui/svelte";
import type { Component } from "svelte";
import HugeiconsIcon from "$lib/hugeicons-icon.svelte";
import { cn } from "$lib/utils.js";
import { getNumberFieldContext } from "./context.js";

const StepButton = ButtonPrimitive as unknown as Component<Record<string, unknown>, object, "ref">;

let {
  class: className,
  direction,
  onclick,
  ref = $bindable(null),
  ...props
}: NumberFieldStepButtonProps = $props();
const context = getNumberFieldContext();
const increment = $derived(direction === 1);

function handleClick(event: MouseEvent): void {
  onclick?.(event as Parameters<NonNullable<typeof onclick>>[0]);
  if (!event.defaultPrevented) context.stepBy(direction);
}
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
