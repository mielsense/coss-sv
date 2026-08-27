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
import { cn } from "$lib/utils.js";
import { setOTPFieldContext } from "./context.js";
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

let nextIndex = 0;
let activeIndex = $state(0);
const inputs = new Map<number, HTMLInputElement>();
const isReadonly = $derived(readonly || readOnly);

function clean(raw: string): string {
  const normalized = normalizeValue?.(raw) ?? raw;
  const accepted = normalizeOTP(normalized, validationType);
  if (accepted !== raw) onValueInvalid?.(raw);
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
  const next = Math.min(length - 1, Math.max(0, index));
  activeIndex = next;
  queueMicrotask(() => {
    const input = inputs.get(next);
    input?.focus();
    input?.select();
  });
}

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
  claimIndex() {
    const claimed = nextIndex;
    nextIndex += 1;
    return claimed;
  },
  delete(index, backward) {
    if (disabled || isReadonly) return;
    const existing = value[index] ?? "";
    if (backward && !existing && index > 0) {
      const target = index - 1;
      update(value.slice(0, target) + value.slice(target + 1));
      focus(target);
      return;
    }
    update(value.slice(0, index) + value.slice(index + 1));
    focus(index);
  },
  focus,
  insert(raw, index) {
    if (disabled || isReadonly) return;
    const accepted = clean(raw);
    if (!accepted) return;
    update(replaceOTPRange(value, accepted, index, length));
    focus(Math.min(length - 1, index + accepted.length));
  },
  register(index, input) {
    if (input) inputs.set(index, input);
    else inputs.delete(index);
  },
  valueAt(index) {
    return value[index] ?? "";
  },
});
</script>

<!-- biome-ignore lint/a11y/useSemanticElements: COSS and Base UI expose the segmented inputs through a div group. -->
<div
  bind:this={ref}
  aria-describedby={ariaDescribedBy}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledBy}
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
    <input type="hidden" {name} {value} {disabled}>
  {/if}
</div>
