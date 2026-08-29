<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { NumberFieldGroupProps } from "./number-field-group.svelte";

  export type NumberFieldSize = "sm" | "default" | "lg";

  export type NumberFieldChangeEventReason =
    | "decrement-press"
    | "increment-press"
    | "input-blur"
    | "input-change"
    | "input-clear"
    | "input-paste"
    | "keyboard"
    | "none"
    | "scrub"
    | "wheel";
  export type NumberFieldCommitEventReason =
    | "decrement-press"
    | "increment-press"
    | "input-blur"
    | "input-clear"
    | "keyboard"
    | "none"
    | "scrub"
    | "wheel";
  export type NumberFieldEventForReason<Reason extends NumberFieldChangeEventReason> =
    Reason extends "input-blur"
      ? FocusEvent
      : Reason extends "keyboard"
        ? KeyboardEvent
        : Reason extends "wheel"
          ? WheelEvent
          : Reason extends "scrub"
            ? PointerEvent
            : Reason extends "increment-press" | "decrement-press"
              ? MouseEvent | PointerEvent | TouchEvent
              : Reason extends "input-paste"
                ? ClipboardEvent
                : Event;
  export type NumberFieldChangeEventDetails<
    Reason extends NumberFieldChangeEventReason = NumberFieldChangeEventReason,
  > = Reason extends NumberFieldChangeEventReason
    ? {
        allowPropagation(): void;
        cancel(): void;
        direction?: -1 | 1;
        event: NumberFieldEventForReason<Reason>;
        isCanceled: boolean;
        isPropagationAllowed: boolean;
        reason: Reason;
        trigger: Element | undefined;
      }
    : never;
  export type NumberFieldCommitEventDetails<
    Reason extends NumberFieldCommitEventReason = NumberFieldCommitEventReason,
  > = Reason extends NumberFieldCommitEventReason
    ? {
        event: NumberFieldEventForReason<Reason>;
        reason: Reason;
      }
    : never;

  export type NumberFieldRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "id"> & {
    allowOutOfRange?: boolean;
    allowWheel?: boolean;
    allowWheelScrub?: boolean;
    children?: Snippet;
    defaultValue?: number | null;
    delegate?: Snippet<[NumberFieldGroupProps]>;
    disabled?: boolean;
    form?: string;
    format?: Intl.NumberFormatOptions;
    id?: string;
    locale?: string | string[];
    largeStep?: number;
    max?: number;
    min?: number;
    name?: string;
    onValueChange?: (value: number | null, details: NumberFieldChangeEventDetails) => void;
    onValueCommitted?: (value: number | null, details: NumberFieldCommitEventDetails) => void;
    readonly?: boolean;
    readOnly?: boolean;
    ref?: HTMLDivElement | null;
    required?: boolean;
    size?: NumberFieldSize;
    smallStep?: number;
    snapOnStep?: boolean;
    step?: number | "any";
    value?: number | null;
  };
</script>

<script lang="ts">
  import { untrack } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { createAttachmentKey } from "svelte/attachments";
  import { cn } from "$lib/utils.js";
  import { getFieldRelationshipContext } from "../field/relationship-context.svelte.js";
  import { setNumberFieldContext } from "./context.js";
  import {
    clampValue,
    createNumberLocale,
    formatNumber,
    parseNumber,
    snapValueToStep,
  } from "./number-field-machine.js";

  const uid = $props.id();
  const relationships = getFieldRelationshipContext();

  let {
    allowOutOfRange = false,
    allowWheel = false,
    allowWheelScrub,
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
    largeStep = 10,
    max,
    min,
    name,
    onValueChange,
    onValueCommitted,
    readonly = false,
    readOnly = false,
    ref = $bindable(null),
    required = false,
    size = "default",
    smallStep = 0.1,
    snapOnStep = false,
    step = 1,
    value = $bindable(defaultValue),
    ...props
  }: NumberFieldRootProps = $props();

  let input = $state<HTMLInputElement | null>(null);
  let scrubLabelId = $state<string | undefined>();
  let editing = $state(false);
  let dirtyInput = $state(false);
  const interactionStep = $derived(step === "any" ? 1 : step);
  const wheelScrub = $derived(allowWheelScrub ?? allowWheel);
  const id = $derived(idProp ?? relationships?.resolveDefaultControlId(uid) ?? uid);
  let raw = $state(untrack(() => formatNumber(value, locale, format)));
  const numberLocale = $derived(createNumberLocale(locale));
  const ariaValue = $derived.by(() => {
    return parseInputValue(raw);
  });
  const isReadonly = $derived(readonly || readOnly);
  const inputMode = $derived(
    format?.style === "percent" || Number.isInteger(interactionStep) ? "numeric" : "decimal",
  );

  function parseInputValue(nextRaw: string): number | null {
    const parsed = parseNumber(nextRaw, numberLocale);
    return parsed !== null && format?.style === "percent" ? parsed / 100 : parsed;
  }

  function createChangeDetails(
    reason: NumberFieldChangeEventReason,
    event: Event,
    direction?: -1 | 1,
  ): NumberFieldChangeEventDetails {
    const details = {
      allowPropagation() {
        details.isPropagationAllowed = true;
      },
      cancel() {
        details.isCanceled = true;
      },
      ...(direction === undefined ? {} : { direction }),
      event,
      isCanceled: false,
      isPropagationAllowed: false,
      reason,
      trigger: event.currentTarget instanceof Element ? event.currentTarget : undefined,
    } as NumberFieldChangeEventDetails;
    return details;
  }

  function createCommitDetails(
    reason: NumberFieldCommitEventReason,
    event: Event,
  ): NumberFieldCommitEventDetails {
    return { event, reason } as NumberFieldCommitEventDetails;
  }

  function updateValue(
    next: number | null,
    reason: NumberFieldChangeEventReason,
    event: Event,
    options: { clamp?: boolean; direction?: -1 | 1; nearest?: boolean; step?: number } = {},
  ): "canceled" | "changed" | "unchanged" {
    let normalized = next;
    if (normalized !== null) {
      if (snapOnStep && options.direction && options.step) {
        normalized = snapValueToStep(
          normalized,
          options.step,
          min,
          options.direction,
          options.nearest,
        );
      }
      if (options.clamp !== false) {
        normalized = clampValue(normalized, min, max, options.step ?? interactionStep);
      }
    }
    if (value !== normalized) {
      const details = createChangeDetails(reason, event, options.direction);
      onValueChange?.(normalized, details);
      if (details.isCanceled) return "canceled";
      value = normalized;
      raw = formatNumber(normalized, locale, format);
      return "changed";
    }
    raw = formatNumber(normalized, locale, format);
    return "unchanged";
  }

  function commit(event: Event, reason: "input-blur" | "keyboard" | "scrub" = "input-blur"): void {
    if (reason === "scrub") {
      onValueCommitted?.(value, createCommitDetails(reason, event));
      return;
    }
    editing = false;
    const parsed = parseInputValue(raw);
    const commitReason = raw.trim() === "" ? "input-clear" : reason;
    const result = updateValue(parsed, reason, event, { clamp: !allowOutOfRange });
    if (result !== "canceled" && (dirtyInput || (reason === "keyboard" && result === "changed"))) {
      onValueCommitted?.(value, createCommitDetails(commitReason, event));
    }
    dirtyInput = false;
  }

  function setInput(next: string, event: InputEvent | Event): void {
    const parsed = parseInputValue(next);
    const partial =
      next === "-" ||
      next === numberLocale.minus ||
      next === numberLocale.decimal ||
      next === `-${numberLocale.decimal}` ||
      next === `${numberLocale.minus}${numberLocale.decimal}`;
    if (parsed === null && next !== "" && !partial) return;
    editing = true;
    dirtyInput = true;
    raw = next;
    if (
      parsed !== null &&
      (allowOutOfRange ||
        (parsed >= (min ?? Number.NEGATIVE_INFINITY) &&
          parsed <= (max ?? Number.POSITIVE_INFINITY)))
    ) {
      updateValue(parsed, "input-change", event, { clamp: false });
      raw = next;
    } else if (next === "") {
      updateValue(null, "input-clear", event, { clamp: false });
      raw = next;
    }
  }

  function stepBy(
    multiplier: number,
    event: KeyboardEvent | MouseEvent | WheelEvent,
    reason: "decrement-press" | "increment-press" | "keyboard" | "wheel",
  ): void {
    if (disabled || isReadonly) return;
    const amount = event.altKey ? smallStep : event.shiftKey ? largeStep : interactionStep;
    const direction = multiplier > 0 ? 1 : -1;
    const base = parseInputValue(raw) ?? value ?? (multiplier > 0 ? (min ?? 0) : (max ?? 0));
    if (
      updateValue(base + amount * multiplier, reason, event, {
        direction,
        nearest: event.altKey,
        step: amount,
      }) === "changed"
    ) {
      dirtyInput = false;
      onValueCommitted?.(value, createCommitDetails(reason, event));
    }
    input?.focus();
  }

  $effect(() => {
    if (!editing) raw = formatNumber(value, locale, format);
  });

  setNumberFieldContext({
    get allowWheel() {
      return wheelScrub;
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
    scrub(delta, event) {
      if (disabled || isReadonly || delta === 0) return;
      const direction = delta > 0 ? 1 : -1;
      const base = parseInputValue(raw) ?? value ?? (delta > 0 ? (min ?? 0) : (max ?? 0));
      updateValue(base + interactionStep * delta, "scrub", event, {
        direction,
        step: interactionStep,
      });
    },
    setBoundary(next, event) {
      if (disabled || isReadonly) return;
      if (updateValue(next, "keyboard", event) === "changed") {
        dirtyInput = false;
        onValueCommitted?.(value, createCommitDetails("keyboard", event));
      }
      input?.focus();
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
