<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes, HTMLInputAttributes } from "svelte/elements";
  import type { OTPValidationType } from "./otp-field-machine.js";

  export type OTPFieldSize = "default" | "lg";
  export type OTPFieldChangeReason = "input-change" | "input-clear" | "input-paste" | "keyboard";
  export type OTPFieldInvalidReason = "input-change" | "input-paste";
  export type OTPFieldCompleteReason = "input-change" | "input-paste";
  export type OTPFieldEventForReason<Reason extends string> = Reason extends "input-paste"
    ? ClipboardEvent
    : Reason extends "keyboard"
      ? KeyboardEvent
      : InputEvent | Event;
  export type OTPFieldChangeEventDetails<
    Reason extends OTPFieldChangeReason = OTPFieldChangeReason,
  > = Reason extends OTPFieldChangeReason
    ? {
        allowPropagation(): void;
        cancel(): void;
        event: OTPFieldEventForReason<Reason>;
        isCanceled: boolean;
        isPropagationAllowed: boolean;
        reason: Reason;
        trigger: Element | undefined;
      }
    : never;
  export type OTPFieldInvalidEventDetails<
    Reason extends OTPFieldInvalidReason = OTPFieldInvalidReason,
  > = Reason extends OTPFieldInvalidReason
    ? { event: OTPFieldEventForReason<Reason>; reason: Reason }
    : never;
  export type OTPFieldCompleteEventDetails<
    Reason extends OTPFieldCompleteReason = OTPFieldCompleteReason,
  > = Reason extends OTPFieldCompleteReason
    ? { event: OTPFieldEventForReason<Reason>; reason: Reason }
    : never;

  type InputMode = "decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url";

  export type OTPFieldRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "id"> & {
    autoComplete?: HTMLInputAttributes["autocomplete"];
    autocomplete?: HTMLInputAttributes["autocomplete"];
    autoSubmit?: boolean;
    children?: Snippet;
    defaultValue?: string;
    disabled?: boolean;
    form?: string;
    id?: string;
    inputMode?: InputMode;
    inputmode?: InputMode;
    length: number;
    mask?: boolean;
    name?: string;
    normalizeValue?: (value: string) => string;
    /** @deprecated Use `onValueComplete`. */
    onComplete?: (value: string, eventDetails: OTPFieldCompleteEventDetails) => void;
    onValueChange?: (value: string, eventDetails: OTPFieldChangeEventDetails) => void;
    onValueComplete?: (value: string, eventDetails: OTPFieldCompleteEventDetails) => void;
    onValueInvalid?: (value: string, eventDetails: OTPFieldInvalidEventDetails) => void;
    readonly?: boolean;
    readOnly?: boolean;
    ref?: HTMLDivElement | null;
    required?: boolean;
    size?: OTPFieldSize;
    validationType?: OTPValidationType;
    value?: string;
  };
</script>

<script lang="ts">
  import { untrack } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { cn } from "@/utils.js";
  import { getFieldRelationshipContext } from "../field/relationship-context.svelte.js";
  import type { OTPFieldSlot } from "./context.js";
  import { setOTPFieldContext } from "./context.js";
  import {
    normalizeOTPValue,
    normalizeOTPValueWithDetails,
    replaceOTPRange,
  } from "./otp-field-machine.js";

  const uid = $props.id();
  const parentFieldRelationships = getFieldRelationshipContext();

  let {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    autoComplete,
    autocomplete,
    autoSubmit = false,
    children,
    class: className,
    defaultValue = "",
    disabled = false,
    form,
    id: idProp,
    inputMode,
    inputmode,
    length,
    mask = false,
    name,
    normalizeValue,
    onComplete,
    onValueChange,
    onValueComplete,
    onValueInvalid,
    readonly = false,
    readOnly = false,
    ref = $bindable(null),
    required = false,
    size = "default",
    validationType = "numeric",
    value = $bindable(defaultValue),
    ...props
  }: OTPFieldRootProps = $props();

  let activeIndex = $state(0);
  let slotVersion = $state(0);
  let nativeInput = $state<HTMLInputElement | null>(null);
  const slots: OTPFieldSlot[] = [];
  const id = $derived(idProp ?? parentFieldRelationships?.resolveDefaultControlId(uid) ?? uid);
  const isReadonly = $derived(readonly || readOnly);
  const isDisabled = $derived(disabled || (parentFieldRelationships?.disabled ?? false));
  const effectiveName = $derived(name ?? parentFieldRelationships?.name);
  const effectiveInvalid = $derived(
    ariaInvalid !== undefined ? ariaInvalid : parentFieldRelationships?.invalid ? true : undefined,
  );
  const effectiveAutocomplete = $derived(autoComplete ?? autocomplete ?? "one-time-code");
  const effectiveInputMode = $derived(
    inputMode ?? inputmode ?? (validationType === "numeric" ? "numeric" : "text"),
  );
  const normalizedValue = $derived(
    normalizeOTPValue(value, length, validationType, normalizeValue),
  );
  const initialValue = untrack(() =>
    normalizeOTPValue(defaultValue, length, validationType, normalizeValue),
  );
  const resolvedLabelledBy = $derived(
    ariaLabel !== undefined || ariaLabelledBy !== undefined
      ? ariaLabelledBy
      : parentFieldRelationships?.labelledBy,
  );
  const resolvedDescribedBy = $derived(
    ariaDescribedBy !== undefined ? ariaDescribedBy : parentFieldRelationships?.describedBy,
  );
  const validationPattern = $derived(
    validationType === "numeric"
      ? `[0-9]{${length}}`
      : validationType === "alpha"
        ? `[A-Za-z]{${length}}`
        : validationType === "alphanumeric"
          ? `[A-Za-z0-9]{${length}}`
          : undefined,
  );

  function eventTrigger(event: Event): Element | undefined {
    return event.currentTarget instanceof Element ? event.currentTarget : undefined;
  }

  function createChangeDetails(
    reason: OTPFieldChangeReason,
    event: Event,
  ): OTPFieldChangeEventDetails {
    const details = {
      allowPropagation() {
        details.isPropagationAllowed = true;
      },
      cancel() {
        details.isCanceled = true;
      },
      event,
      isCanceled: false,
      isPropagationAllowed: false,
      reason,
      trigger: eventTrigger(event),
    } as OTPFieldChangeEventDetails;
    return details;
  }

  function complete(next: string, event: Event, reason: OTPFieldCompleteReason): void {
    const details = { event, reason } as OTPFieldCompleteEventDetails;
    onValueComplete?.(next, details);
    onComplete?.(next, details);
    if (!autoSubmit) return;
    if (nativeInput) nativeInput.value = next;
    nativeInput?.form?.requestSubmit();
  }

  function update(
    next: string,
    event: Event,
    reason: OTPFieldChangeReason,
    completeSamePaste = false,
  ): void {
    const normalized = normalizeOTPValue(next, length, validationType, normalizeValue);
    if (normalizedValue === normalized) {
      if (completeSamePaste && normalized.length === length)
        complete(normalized, event, "input-paste");
      return;
    }
    const details = createChangeDetails(reason, event);
    onValueChange?.(normalized, details);
    if (details.isCanceled) return;
    value = normalized;
    if (normalized.length === length && (reason === "input-change" || reason === "input-paste")) {
      complete(normalized, event, reason);
    }
  }

  function clean(raw: string, event: Event, reason: OTPFieldInvalidReason): string {
    const [accepted, didRejectCharacters] = normalizeOTPValueWithDetails(
      raw,
      length,
      validationType,
      normalizeValue,
    );
    if (didRejectCharacters) {
      onValueInvalid?.(raw, { event, reason } as OTPFieldInvalidEventDetails);
    }
    return accepted;
  }

  function focus(index: number): void {
    reorderSlots();
    const next = Math.min(length - 1, Math.max(0, index));
    activeIndex = next;
    queueMicrotask(() => {
      const input = slots[next]?.element;
      input?.focus();
      input?.select();
    });
  }

  function reorderSlots(): void {
    slots.sort((a, b) => {
      if (!a.element || !b.element || a.element === b.element) return 0;
      return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
    });
    activeIndex = Math.min(Math.max(0, activeIndex), Math.max(0, slots.length - 1));
    slotVersion += 1;
  }

  function removeAt(index: number, event: Event): void {
    update(normalizedValue.slice(0, index) + normalizedValue.slice(index + 1), event, "keyboard");
  }

  function replaceAt(
    raw: string,
    slot: OTPFieldSlot,
    event: Event,
    reason: "input-change" | "input-paste",
  ): void {
    if (isDisabled || isReadonly) return;
    const index = slots.indexOf(slot);
    if (index < 0) return;
    if (!raw) {
      update(
        normalizedValue.slice(0, index) + normalizedValue.slice(index + 1),
        event,
        "input-clear",
      );
      focus(index);
      return;
    }
    const accepted = clean(raw, event, reason);
    if (!accepted) return;
    update(
      replaceOTPRange(normalizedValue, accepted, index, length),
      event,
      reason,
      reason === "input-paste",
    );
    focus(Math.min(length - 1, index + accepted.length));
  }

  const formReset: Attachment<HTMLDivElement> = (node) => {
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    const owner = form
      ? document.getElementById(form) instanceof HTMLFormElement
        ? (document.getElementById(form) as HTMLFormElement)
        : null
      : node.closest("form");
    const reset = () => {
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        value = initialValue;
        reorderSlots();
        for (const [index, slot] of slots.entries()) {
          if (slot.element) slot.element.value = initialValue[index] ?? "";
        }
        slotVersion += 1;
      });
    };
    owner?.addEventListener("reset", reset);
    return () => {
      clearTimeout(resetTimer);
      owner?.removeEventListener("reset", reset);
    };
  };

  setOTPFieldContext({
    get activeIndex() {
      return activeIndex;
    },
    get ariaInvalid() {
      return effectiveInvalid;
    },
    get autocomplete() {
      return effectiveAutocomplete;
    },
    get disabled() {
      return isDisabled;
    },
    get id() {
      return id;
    },
    get inputMode() {
      return effectiveInputMode;
    },
    get length() {
      return length;
    },
    get mask() {
      return mask;
    },
    get readonly() {
      return isReadonly;
    },
    get validationType() {
      return validationType;
    },
    clear(event) {
      if (isDisabled || isReadonly) return;
      update("", event, "keyboard");
      focus(0);
    },
    createSlot() {
      const slot: OTPFieldSlot = { key: Symbol("otp-field-slot"), element: null };
      slots.push(slot);
      return slot;
    },
    delete(slot, backward, event) {
      if (isDisabled || isReadonly) return;
      const index = slots.indexOf(slot);
      if (index < 0) return;
      const existing = normalizedValue[index] ?? "";
      if (backward && existing) {
        removeAt(index, event);
        focus(Math.max(0, index - 1));
        return;
      }
      if (backward && index > 0) {
        const target = index - 1;
        removeAt(target, event);
        focus(target);
        return;
      }
      removeAt(index, event);
      focus(index);
    },
    focus,
    indexOf(slot) {
      slotVersion;
      return slots.indexOf(slot);
    },
    input(raw, slot, event) {
      replaceAt(raw, slot, event, "input-change");
    },
    paste(raw, slot, event) {
      replaceAt(raw, slot, event, "input-paste");
    },
    register(slot, input) {
      slot.element = input;
      queueMicrotask(reorderSlots);
    },
    unregister(slot) {
      const index = slots.indexOf(slot);
      if (index >= 0) slots.splice(index, 1);
      reorderSlots();
    },
    valueAt(slot) {
      slotVersion;
      const index = slots.indexOf(slot);
      return normalizedValue[index] ?? "";
    },
  });

  function focusFirstInput(event: Event): void {
    event.preventDefault();
    focus(0);
  }
</script>

<!-- biome-ignore lint/a11y/useSemanticElements: COSS and Base UI expose the segmented inputs through a div group. -->
<div
  {@attach formReset}
  bind:this={ref}
  aria-describedby={resolvedDescribedBy}
  aria-label={ariaLabel}
  aria-labelledby={resolvedLabelledBy}
  class={cn(
    "flex items-center gap-2 has-disabled:opacity-64 has-disabled:**:data-[slot=otp-field-input]:shadow-none has-disabled:**:data-[slot=otp-field-input]:before:shadow-none!",
    className,
  )}
  data-disabled={isDisabled ? "" : undefined}
  data-size={size}
  data-slot="otp-field"
  role="group"
  {...props}
>
  {@render children?.()}
  <input
    bind:this={nativeInput}
    aria-hidden="true"
    autocomplete={effectiveAutocomplete}
    class="pointer-events-none absolute size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
    disabled={isDisabled}
    {form}
    inputmode={effectiveInputMode}
    maxlength={length}
    minlength={length}
    name={effectiveName}
    oninvalid={focusFirstInput}
    pattern={validationPattern}
    readonly={isReadonly}
    {required}
    tabindex="-1"
    type="text"
    value={normalizedValue}
  />
</div>
