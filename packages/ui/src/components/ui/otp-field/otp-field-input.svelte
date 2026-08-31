<script module lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  export type OTPFieldInputProps = Omit<HTMLInputAttributes, "class" | "value"> & {
    class?: string;
    ref?: HTMLInputElement | null;
  };
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { cn } from "@/utils.js";
  import { getFieldRelationshipContext } from "../field/relationship-context.svelte.js";
  import { getOTPFieldContext } from "./context.js";

  let {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    autocomplete,
    class: className,
    disabled: disabledProp = false,
    enterkeyhint,
    id: idProp,
    inputmode,
    maxlength,
    onblur,
    onfocus,
    oninput,
    onkeydown,
    onpaste,
    readonly: readonlyProp = false,
    ref = $bindable(null),
    required,
    type,
    ...props
  }: OTPFieldInputProps = $props();

  const context = getOTPFieldContext();
  const parentFieldRelationships = getFieldRelationshipContext();
  const slot = context.createSlot();
  const index = $derived(context.indexOf(slot));
  const id = $derived(idProp ?? (index === 0 ? context.id : `${context.id}-${index + 1}`));
  const computedLabelledBy = $derived(
    ariaLabelledBy !== undefined
      ? ariaLabelledBy
      : ariaLabel === undefined && index === 0
        ? parentFieldRelationships?.labelledBy
        : undefined,
  );
  let slotValue = $derived(context.valueAt(slot));

  $effect(() => {
    const nextId = id;
    const nextIndex = index;
    if (nextIndex !== 0 || !nextId) return;
    parentFieldRelationships?.registerInitialControlId(nextId);
    return parentFieldRelationships?.registerControlId(nextId);
  });

  onDestroy(() => context.unregister(slot));

  const inputBehavior: Attachment<HTMLInputElement> = (node) => {
    context.register(slot, node);
    node.addEventListener("blur", handleBlur);
    node.addEventListener("focus", handleFocus);
    node.addEventListener("input", handleInput);
    node.addEventListener("keydown", handleKeydown);
    node.addEventListener("paste", handlePaste);
    return () => {
      context.register(slot, null);
      node.removeEventListener("blur", handleBlur);
      node.removeEventListener("focus", handleFocus);
      node.removeEventListener("input", handleInput);
      node.removeEventListener("keydown", handleKeydown);
      node.removeEventListener("paste", handlePaste);
    };
  };

  function handleInput(event: Event): void {
    const target = event.currentTarget as HTMLInputElement;
    const raw = target.value;
    oninput?.(event as Parameters<NonNullable<typeof oninput>>[0]);
    if (!event.defaultPrevented) context.input(raw, slot, event);
    target.value = context.valueAt(slot);
  }

  function handlePaste(event: ClipboardEvent): void {
    onpaste?.(event as Parameters<NonNullable<typeof onpaste>>[0]);
    if (event.defaultPrevented) return;
    const pasted = event.clipboardData?.getData("text") ?? "";
    if (!pasted) return;
    event.preventDefault();
    context.paste(pasted, slot, event);
  }

  function handleKeydown(event: KeyboardEvent): void {
    onkeydown?.(event as Parameters<NonNullable<typeof onkeydown>>[0]);
    if (event.defaultPrevented) return;
    const modifier = event.ctrlKey || event.metaKey;
    const rtl = getComputedStyle(event.currentTarget as Element).direction === "rtl";
    const previousKey = rtl ? "ArrowRight" : "ArrowLeft";
    const nextKey = rtl ? "ArrowLeft" : "ArrowRight";

    if (event.key === previousKey || event.key === "ArrowUp") {
      event.preventDefault();
      context.focus(modifier ? 0 : index - 1);
    } else if (event.key === nextKey || event.key === "ArrowDown") {
      event.preventDefault();
      context.focus(modifier ? context.length - 1 : index + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      context.focus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      context.focus(context.length - 1);
    } else if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      if (modifier) context.clear(event);
      else context.delete(slot, event.key === "Backspace", event);
    }
  }

  function handleFocus(event: FocusEvent): void {
    onfocus?.(event as Parameters<NonNullable<typeof onfocus>>[0]);
    if (!event.defaultPrevented) context.focus(index);
  }

  function handleBlur(event: FocusEvent): void {
    onblur?.(event as Parameters<NonNullable<typeof onblur>>[0]);
  }
</script>

<input
  {@attach inputBehavior}
  bind:this={ref}
  bind:value={slotValue}
  aria-describedby={ariaDescribedBy}
  aria-invalid={ariaInvalid ?? context.ariaInvalid}
  aria-label={ariaLabel}
  aria-labelledby={computedLabelledBy}
  autocomplete={autocomplete ?? (index === 0 ? context.autocomplete : "off")}
  autocorrect="off"
  class={cn(
    "relative in-[[data-slot=otp-field][data-size=lg]]:size-10 size-9 min-w-0 rounded-lg border border-input bg-background not-dark:bg-clip-padding text-center in-[[data-slot=otp-field][data-size=lg]]:text-lg text-base text-foreground in-[[data-slot=otp-field][data-size=lg]]:leading-10 leading-9 shadow-xs/5 outline-none ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:z-10 focus-visible:border-ring focus-visible:shadow-none focus-visible:ring-[3px] focus-visible:ring-ring/24 aria-invalid:border-destructive/36 aria-invalid:shadow-none aria-invalid:focus-visible:border-destructive/64 aria-invalid:focus-visible:ring-destructive/16 sm:in-[[data-slot=otp-field][data-size=lg]]:size-9 sm:size-8 sm:in-[[data-slot=otp-field][data-size=lg]]:text-base sm:text-sm sm:in-[[data-slot=otp-field][data-size=lg]]:leading-9 sm:leading-8 dark:bg-input/32 dark:aria-invalid:focus-visible:ring-destructive/24 dark:not-focus-visible:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
    className,
  )}
  data-length={context.length}
  data-slot="otp-field-input"
  disabled={context.disabled || disabledProp}
  enterkeyhint={enterkeyhint ?? (index === context.length - 1 ? "done" : "next")}
  {id}
  inputmode={inputmode ?? context.inputMode}
  maxlength={maxlength ?? (index === 0 ? context.length : 1)}
  readonly={context.readonly || readonlyProp}
  {required}
  spellcheck={false}
  tabindex={context.activeIndex === index ? 0 : -1}
  type={type ?? (context.mask ? "password" : "text")}
  {...props}
/>
