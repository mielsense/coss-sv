<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import type { OTPValidationType } from "./otp-field-machine.js";

export type OTPFieldSize = "default" | "lg";
export type OTPFieldRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  autocomplete?: string;
  children?: Snippet;
  defaultValue?: string;
  disabled?: boolean;
  form?: string;
  inputmode?: "decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url";
  length: number;
  mask?: boolean;
  name?: string;
  normalizeValue?: (value: string) => string;
  onComplete?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onValueInvalid?: (value: string) => void;
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
import { cn } from "$lib/utils.js";
import { getFieldRelationshipContext } from "../field/relationship-context.svelte.js";
import type { OTPFieldSlot } from "./context.js";
import { setOTPFieldContext } from "./context.js";
import { getFieldRelationships, observeFieldRelationships } from "./field-relationships.js";
import { normalizeOTP, replaceOTPRange } from "./otp-field-machine.js";

let {
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  autocomplete = "one-time-code",
  children,
  class: className,
  defaultValue = "",
  disabled = false,
  form,
  inputmode = "numeric",
  length,
  mask = false,
  name,
  normalizeValue,
  onComplete,
  onValueChange,
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
const slots: OTPFieldSlot[] = [];
const isReadonly = $derived(readonly || readOnly);
const initialValue = untrack(() => clean(defaultValue).slice(0, length));
const parentFieldRelationships = getFieldRelationshipContext();
const resolvedLabelledBy = $derived(
  ariaLabel !== undefined || ariaLabelledBy !== undefined
    ? ariaLabelledBy
    : parentFieldRelationships?.labelledBy,
);
const resolvedDescribedBy = $derived(
  ariaDescribedBy !== undefined ? ariaDescribedBy : parentFieldRelationships?.describedBy,
);

function clean(raw: string): string {
  const normalized = normalizeValue?.(raw) ?? raw;
  const accepted = normalizeOTP(normalized, validationType);
  if (accepted !== normalized || Array.from(normalized).length < Array.from(raw).length) {
    onValueInvalid?.(raw);
  }
  return accepted;
}

function update(next: string): void {
  const clipped = next.slice(0, length);
  if (value === clipped) return;
  value = clipped;
  onValueChange?.(clipped);
  if (clipped.length === length) onComplete?.(clipped);
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
    return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
  activeIndex = Math.min(Math.max(0, activeIndex), Math.max(0, slots.length - 1));
  slotVersion += 1;
}

const formReset: Attachment<HTMLDivElement> = (node) => {
  const owner = form
    ? document.getElementById(form) instanceof HTMLFormElement
      ? (document.getElementById(form) as HTMLFormElement)
      : null
    : node.closest("form");
  const reset = () => queueMicrotask(() => update(initialValue));
  owner?.addEventListener("reset", reset);
  return () => owner?.removeEventListener("reset", reset);
};

const fieldRelationships: Attachment<HTMLDivElement> = (node) => {
  let managedLabel: string | undefined;
  let managedDescription: string | undefined;

  const sync = () => {
    const relationships = getFieldRelationships(node);
    if (!relationships) return;

    const nextLabel =
      ariaLabel !== undefined || ariaLabelledBy !== undefined
        ? undefined
        : relationships.labelledBy;
    if (nextLabel && node.getAttribute("aria-labelledby") !== nextLabel)
      node.setAttribute("aria-labelledby", nextLabel);
    else if (managedLabel && node.getAttribute("aria-labelledby") === managedLabel)
      node.removeAttribute("aria-labelledby");
    managedLabel = nextLabel;

    const nextDescription = ariaDescribedBy !== undefined ? undefined : relationships.describedBy;
    if (nextDescription && node.getAttribute("aria-describedby") !== nextDescription)
      node.setAttribute("aria-describedby", nextDescription);
    else if (managedDescription && node.getAttribute("aria-describedby") === managedDescription)
      node.removeAttribute("aria-describedby");
    managedDescription = nextDescription;
  };

  const stop = observeFieldRelationships(node, sync);
  sync();
  return () => {
    stop();
    if (managedLabel && node.getAttribute("aria-labelledby") === managedLabel)
      node.removeAttribute("aria-labelledby");
    if (managedDescription && node.getAttribute("aria-describedby") === managedDescription)
      node.removeAttribute("aria-describedby");
  };
};

setOTPFieldContext({
  get activeIndex() {
    return activeIndex;
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
  get autocomplete() {
    return autocomplete;
  },
  get disabled() {
    return disabled;
  },
  get form() {
    return form;
  },
  get inputMode() {
    return inputmode;
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
  get required() {
    return required;
  },
  get validationType() {
    return validationType;
  },
  createSlot() {
    const slot: OTPFieldSlot = { key: Symbol("otp-field-slot"), element: null };
    slots.push(slot);
    return slot;
  },
  delete(slot, backward) {
    if (disabled || isReadonly) return;
    const index = slots.indexOf(slot);
    if (index < 0) return;
    const existing = value[index] ?? "";
    if (backward && existing) {
      update(value.slice(0, index) + value.slice(index + 1));
      focus(Math.max(0, index - 1));
      return;
    }
    if (backward && index > 0) {
      const target = index - 1;
      update(value.slice(0, target) + value.slice(target + 1));
      focus(target);
      return;
    }
    update(value.slice(0, index) + value.slice(index + 1));
    focus(index);
  },
  focus,
  indexOf(slot) {
    slotVersion;
    return slots.indexOf(slot);
  },
  insert(raw, slot) {
    if (disabled || isReadonly) return;
    const index = slots.indexOf(slot);
    if (index < 0) return;
    const accepted = clean(raw);
    if (!accepted) return;
    update(replaceOTPRange(value, accepted, index, length));
    focus(Math.min(length - 1, index + accepted.length));
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
    return value[index] ?? "";
  },
});
</script>

<!-- biome-ignore lint/a11y/useSemanticElements: COSS and Base UI expose the segmented inputs through a div group. -->
<div
  {@attach fieldRelationships}
  {@attach formReset}
  bind:this={ref}
  aria-describedby={resolvedDescribedBy}
  aria-label={ariaLabel}
  aria-labelledby={resolvedLabelledBy}
  class={cn(
    "flex items-center gap-2 has-disabled:opacity-64 has-disabled:**:data-[slot=otp-field-input]:shadow-none has-disabled:**:data-[slot=otp-field-input]:before:shadow-none!",
    className,
  )}
  data-disabled={disabled ? "" : undefined}
  data-size={size}
  data-slot="otp-field"
  role="group"
  {...props}
>
  {@render children?.()}
  {#if name}
    <input type="hidden" {name} {value} {disabled} {form}>
  {/if}
</div>
