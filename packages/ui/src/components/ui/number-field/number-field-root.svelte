<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type NumberFieldSize = "sm" | "default" | "lg";

export type NumberFieldRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "id"> & {
  allowWheel?: boolean;
  children?: Snippet;
  defaultValue?: number | null;
  disabled?: boolean;
  form?: string;
  format?: Intl.NumberFormatOptions;
  id?: string;
  locale?: string | string[];
  max?: number;
  min?: number;
  name?: string;
  onValueChange?: (value: number | null) => void;
  readonly?: boolean;
  readOnly?: boolean;
  ref?: HTMLDivElement | null;
  required?: boolean;
  size?: NumberFieldSize;
  step?: number;
  value?: number | null;
};
</script>

<script lang="ts">
import { untrack } from "svelte";
import { cn } from "$lib/utils.js";
import { setNumberFieldContext } from "./context.js";
import {
  clampValue,
  createNumberLocale,
  formatNumber,
  parseNumber,
} from "./number-field-machine.js";

const uid = $props.id();

let {
  allowWheel = false,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  class: className,
  defaultValue = null,
  disabled = false,
  form,
  format,
  id = uid,
  locale,
  max,
  min,
  name,
  onValueChange,
  readonly = false,
  readOnly = false,
  ref = $bindable(null),
  required = false,
  size = "default",
  step = 1,
  value = $bindable(defaultValue),
  ...props
}: NumberFieldRootProps = $props();

let input = $state<HTMLInputElement | null>(null);
let editing = $state(false);
let raw = $state(untrack(() => formatNumber(value, locale, format)));
const numberLocale = $derived(createNumberLocale(locale));
const isReadonly = $derived(readonly || readOnly);
const inputMode = $derived(
  format?.style === "percent" || Number.isInteger(step) ? "numeric" : "decimal",
);

function updateValue(next: number | null): void {
  const normalized = next == null ? null : clampValue(next, min, max, step);
  if (value !== normalized) {
    value = normalized;
    onValueChange?.(normalized);
  }
  raw = formatNumber(normalized, locale, format);
}

function commit(): void {
  editing = false;
  const parsed = parseNumber(raw, numberLocale);
  updateValue(
    parsed !== null && format?.style === "percent" && raw.includes(numberLocale.percent)
      ? parsed / 100
      : parsed,
  );
}

function setInput(next: string): void {
  editing = true;
  raw = next;
  const parsed = parseNumber(next, numberLocale);
  if (
    parsed !== null &&
    parsed >= (min ?? Number.NEGATIVE_INFINITY) &&
    parsed <= (max ?? Number.POSITIVE_INFINITY)
  ) {
    if (value !== parsed) {
      value = parsed;
      onValueChange?.(parsed);
    }
  } else if (next === "") {
    if (value !== null) {
      value = null;
      onValueChange?.(null);
    }
  }
}

function stepBy(multiplier: number): void {
  if (disabled || isReadonly) return;
  const base =
    parseNumber(raw, numberLocale) ?? value ?? (multiplier > 0 ? (min ?? 0) : (max ?? 0));
  updateValue(base + step * multiplier);
  input?.focus();
}

$effect(() => {
  if (!editing) raw = formatNumber(value, locale, format);
});

setNumberFieldContext({
  get allowWheel() {
    return allowWheel;
  },
  get ariaDescribedBy() {
    return ariaDescribedBy;
  },
  get ariaInvalid() {
    return ariaInvalid;
  },
  get ariaLabel() {
    return ariaLabel;
  },
  get ariaLabelledBy() {
    return ariaLabelledBy;
  },
  get canDecrement() {
    return !disabled && !isReadonly && (value === null || min === undefined || value > min);
  },
  get canIncrement() {
    return !disabled && !isReadonly && (value === null || max === undefined || value < max);
  },
  get disabled() {
    return disabled;
  },
  get displayValue() {
    return raw;
  },
  get form() {
    return form;
  },
  get id() {
    return id;
  },
  get inputMode() {
    return inputMode;
  },
  get locale() {
    return numberLocale;
  },
  get max() {
    return max;
  },
  get min() {
    return min;
  },
  get name() {
    return name;
  },
  get readonly() {
    return isReadonly;
  },
  get required() {
    return required;
  },
  get size() {
    return size;
  },
  commit,
  registerInput(node) {
    input = node;
  },
  scrub(delta) {
    stepBy(delta);
  },
  setEditing(next) {
    editing = next;
  },
  setInput,
  stepBy,
});
</script>

<div
  bind:this={ref}
  class={cn("flex w-full flex-col items-start gap-2", className)}
  data-disabled={disabled ? "" : undefined}
  data-size={size}
  data-slot="number-field"
  {...props}
>
  {@render children?.()}
</div>
