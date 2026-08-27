<script module lang="ts">
import type { HTMLInputAttributes } from "svelte/elements";

export type NumberFieldInputProps = Omit<
  HTMLInputAttributes,
  "class" | "disabled" | "id" | "name" | "readonly" | "required" | "type" | "value"
> & {
  class?: string;
  ref?: HTMLInputElement | null;
};
</script>

<script lang="ts">
import { Input as ShardsInput } from "@shardsui/svelte";
import type { Component } from "svelte";
import type { Attachment } from "svelte/attachments";
import { cn } from "$lib/utils.js";
import { getNumberFieldContext } from "./context.js";

const InputPrimitive = ShardsInput as unknown as Component<
  Record<string, unknown>,
  object,
  "ref" | "value"
>;

let {
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  class: className,
  onblur,
  onfocus,
  oninput,
  onkeydown,
  onwheel,
  ref = $bindable(null),
  ...props
}: NumberFieldInputProps = $props();

const context = getNumberFieldContext();
let inputValue = $state(context.displayValue);

$effect(() => {
  inputValue = context.displayValue;
});

const inputBehavior: Attachment<HTMLInputElement> = (node) => {
  context.registerInput(node);
  node.addEventListener("blur", handleBlur);
  node.addEventListener("focus", handleFocus);
  node.addEventListener("input", handleInput);
  node.addEventListener("keydown", handleKeydown);
  node.addEventListener("wheel", handleWheel, { passive: false });
  return () => {
    context.registerInput(null);
    node.removeEventListener("blur", handleBlur);
    node.removeEventListener("focus", handleFocus);
    node.removeEventListener("input", handleInput);
    node.removeEventListener("keydown", handleKeydown);
    node.removeEventListener("wheel", handleWheel);
  };
};

function handleInput(event: Event): void {
  const target = event.currentTarget as HTMLInputElement;
  oninput?.(event as Parameters<NonNullable<typeof oninput>>[0]);
  if (!event.defaultPrevented) context.setInput(target.value);
}

function handleFocus(event: FocusEvent): void {
  onfocus?.(event as Parameters<NonNullable<typeof onfocus>>[0]);
  context.setEditing(true);
}

function handleBlur(event: FocusEvent): void {
  onblur?.(event as Parameters<NonNullable<typeof onblur>>[0]);
  context.commit();
}

function handleKeydown(event: KeyboardEvent): void {
  onkeydown?.(event as Parameters<NonNullable<typeof onkeydown>>[0]);
  if (event.defaultPrevented) return;
  const multiplier =
    event.key === "ArrowUp"
      ? 1
      : event.key === "ArrowDown"
        ? -1
        : event.key === "PageUp"
          ? 10
          : event.key === "PageDown"
            ? -10
            : 0;
  if (multiplier !== 0) {
    event.preventDefault();
    context.stepBy(multiplier);
  } else if (event.key === "Home" && context.min !== undefined) {
    event.preventDefault();
    context.setInput(String(context.min));
    context.commit();
  } else if (event.key === "End" && context.max !== undefined) {
    event.preventDefault();
    context.setInput(String(context.max));
    context.commit();
  } else if (event.key === "Enter") {
    context.commit();
  }
}

function handleWheel(event: WheelEvent): void {
  onwheel?.(event as Parameters<NonNullable<typeof onwheel>>[0]);
  if (event.defaultPrevented) return;
  if (context.allowWheel && document.activeElement === event.currentTarget) {
    event.preventDefault();
    context.stepBy(event.deltaY < 0 ? 1 : -1);
  }
}
</script>

<InputPrimitive
  {@attach inputBehavior}
  bind:ref
  bind:value={inputValue}
  aria-describedby={ariaDescribedBy ?? context.ariaDescribedBy}
  aria-invalid={ariaInvalid ?? context.ariaInvalid}
  aria-label={ariaLabel ?? context.ariaLabel}
  aria-labelledby={ariaLabelledBy ?? context.ariaLabelledBy}
  aria-roledescription="Number field"
  autocomplete="off"
  autocorrect="off"
  class={cn(
    "h-8.5 in-data-[size=lg]:h-9.5 in-data-[size=sm]:h-7.5 w-full min-w-0 grow bg-transparent in-data-[size=sm]:px-[calc(--spacing(2.5)-1px)] px-[calc(--spacing(3)-1px)] text-center text-foreground tabular-nums in-data-[size=lg]:leading-9.5 in-data-[size=sm]:leading-7.5 leading-8.5 outline-none sm:h-7.5 sm:in-data-[size=lg]:h-8.5 sm:in-data-[size=sm]:h-6.5 sm:in-data-[size=lg]:leading-8.5 sm:in-data-[size=sm]:leading-8.5 sm:leading-7.5",
    className,
  )}
  data-slot="number-field-input"
  disabled={context.disabled}
  form={context.form}
  id={context.id}
  inputmode={context.inputMode}
  name={context.name}
  readonly={context.readonly}
  required={context.required}
  spellcheck={false}
  type="text"
  {...props}
/>
