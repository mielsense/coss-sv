<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { NumberFieldGroupProps } from "./number-field-group.svelte";

  export type NumberFieldSize = "sm" | "default" | "lg";

  export type NumberFieldRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "id"> & {
    allowWheel?: boolean;
    children?: Snippet;
    defaultValue?: number | null;
    delegate?: Snippet<[NumberFieldGroupProps]>;
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
  import type { Attachment } from "svelte/attachments";
  import { createAttachmentKey } from "svelte/attachments";
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
    delegate,
    disabled = false,
    form,
    format,
    id: idProp,
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
  let scrubLabelId = $state<string | undefined>();
  let editing = $state(false);
  const id = $derived(idProp ?? uid);
  let raw = $state(untrack(() => formatNumber(value, locale, format)));
  const numberLocale = $derived(createNumberLocale(locale));
  const ariaValue = $derived.by(() => {
    const parsed = parseNumber(raw, numberLocale);
    return parsed !== null && format?.style === "percent" && raw.includes(numberLocale.percent)
      ? parsed / 100
      : parsed;
  });
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
    const parsed = parseNumber(next, numberLocale);
    const partial =
      next === "-" ||
      next === numberLocale.minus ||
      next === numberLocale.decimal ||
      next === `-${numberLocale.decimal}` ||
      next === `${numberLocale.minus}${numberLocale.decimal}`;
    if (parsed === null && next !== "" && !partial) return;
    editing = true;
    raw = next;
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
    get ariaValue() {
      return ariaValue;
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
    get defaultAccessibleName() {
      return idProp === undefined ? "Number field" : undefined;
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
    get scrubLabelId() {
      return scrubLabelId;
    },
    get size() {
      return size;
    },
    commit,
    registerInput(node) {
      input = node;
    },
    registerScrubLabelId(nextId) {
      scrubLabelId = nextId;
      return () => {
        if (scrubLabelId === nextId) scrubLabelId = undefined;
      };
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

  const refAttachmentKey = createAttachmentKey();
  const setRef: Attachment<HTMLDivElement> = (node) => {
    ref = node;
    return () => {
      if (ref === node) ref = null;
    };
  };
  const rootClass = "flex w-full flex-col items-start gap-2";
  const delegateProps = $derived({
    ...props,
    ...(children ? { children } : {}),
    "data-disabled": disabled ? "" : undefined,
    "data-size": size,
    "data-slot": "number-field",
    class: cn(rootClass, className),
    [refAttachmentKey]: setRef,
  } satisfies NumberFieldGroupProps);
</script>

{#if delegate}
  {@render delegate(delegateProps)}
{:else}
  <div
    bind:this={ref}
    class={cn(rootClass, className)}
    data-disabled={disabled ? "" : undefined}
    data-size={size}
    data-slot="number-field"
    {...props}
  >
    {@render children?.()}
  </div>
{/if}
