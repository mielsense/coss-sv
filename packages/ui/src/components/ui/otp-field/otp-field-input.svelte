<script module lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  export type OTPFieldInputProps = Omit<
    HTMLInputAttributes,
    | "autocomplete"
    | "class"
    | "disabled"
    | "inputmode"
    | "maxlength"
    | "readonly"
    | "spellcheck"
    | "type"
    | "value"
  > & {
    class?: string;
    ref?: HTMLInputElement | null;
  };
</script>

<script lang="ts">
  import { Input as InputPrimitive } from "@shardsui/svelte";
  import { type Component, onDestroy, untrack } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { cn } from "$lib/utils.js";
  import { getFieldRelationshipContext } from "../field/relationship-context.svelte.js";
  import { getOTPFieldContext } from "./context.js";
  import { getFieldRelationships, observeFieldRelationships } from "./field-relationships.js";

  const Slot = InputPrimitive as unknown as Component<
    Record<string, unknown>,
    object,
    "ref" | "value"
  >;

  const uid = $props.id();

  let {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    class: className,
    id: idProp,
    onblur,
    onfocus,
    oninput,
    onkeydown,
    onpaste,
    ref = $bindable(null),
    ...props
  }: OTPFieldInputProps = $props();

  const context = getOTPFieldContext();
  const parentFieldRelationships = getFieldRelationshipContext();
  const slot = context.createSlot();
  const index = $derived(context.indexOf(slot));
  const id = $derived(
    idProp === undefined
      ? index === 0
        ? (parentFieldRelationships?.defaultControlId ?? uid)
        : uid
      : idProp,
  );
  const explicitRelationships = $derived({
    ...(ariaDescribedBy === undefined ? {} : { "aria-describedby": ariaDescribedBy }),
    ...(ariaLabelledBy !== undefined
      ? { "aria-labelledby": ariaLabelledBy }
      : ariaLabel === undefined && parentFieldRelationships?.labelledBy
        ? { "aria-labelledby": parentFieldRelationships.labelledBy }
        : {}),
  });
  let slotValue = $state(context.valueAt(slot));

  untrack(() => {
    if (context.indexOf(slot) === 0 && id) {
      parentFieldRelationships?.registerInitialControlId(id);
    }
  });
  $effect(() => {
    const nextId = id;
    const nextIndex = index;
    return untrack(() =>
      nextIndex === 0 && nextId ? parentFieldRelationships?.registerControlId(nextId) : undefined,
    );
  });

  onDestroy(() => context.unregister(slot));

  $effect(() => {
    slotValue = context.valueAt(slot);
  });

  const inputBehavior: Attachment<HTMLInputElement> = (node) => {
    context.register(slot, node);
    const syncFieldRelationships = () => {
      const relationships = getFieldRelationships(node);
      if (!relationships) return;

      const inheritedLabels = new Set(relationships.labelledBy?.split(/\s+/).filter(Boolean));
      const inheritedDescriptions = new Set(
        relationships.describedBy?.split(/\s+/).filter(Boolean),
      );
      const removeInherited = (
        attribute: "aria-describedby" | "aria-labelledby",
        ids: Set<string>,
      ) => {
        const current = node.getAttribute(attribute)?.split(/\s+/).filter(Boolean) ?? [];
        const next = current.filter((id) => !ids.has(id)).join(" ");
        if (next) node.setAttribute(attribute, next);
        else node.removeAttribute(attribute);
      };

      if (ariaDescribedBy === null) node.removeAttribute("aria-describedby");
      else if (ariaDescribedBy !== undefined) {
        if (node.getAttribute("aria-describedby") !== ariaDescribedBy)
          node.setAttribute("aria-describedby", ariaDescribedBy);
      } else removeInherited("aria-describedby", inheritedDescriptions);

      if (ariaLabelledBy === null) node.removeAttribute("aria-labelledby");
      else if (ariaLabelledBy !== undefined) {
        if (node.getAttribute("aria-labelledby") !== ariaLabelledBy)
          node.setAttribute("aria-labelledby", ariaLabelledBy);
      } else if (ariaLabel !== undefined) removeInherited("aria-labelledby", inheritedLabels);
    };
    const stopFieldRelationships = observeFieldRelationships(node, syncFieldRelationships);
    syncFieldRelationships();
    node.addEventListener("blur", handleBlur);
    node.addEventListener("focus", handleFocus);
    node.addEventListener("input", handleInput);
    node.addEventListener("keydown", handleKeydown);
    node.addEventListener("paste", handlePaste);
    return () => {
      stopFieldRelationships();
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
    if (event.defaultPrevented) return;
    if (raw) context.insert(raw, slot);
    const acceptedValue = context.valueAt(slot);
    target.value = acceptedValue;
    slotValue = acceptedValue;
  }

  function handlePaste(event: ClipboardEvent): void {
    onpaste?.(event as Parameters<NonNullable<typeof onpaste>>[0]);
    if (event.defaultPrevented) return;
    const pasted = event.clipboardData?.getData("text") ?? "";
    if (pasted) {
      event.preventDefault();
      context.insert(pasted, slot);
    }
  }

  function handleKeydown(event: KeyboardEvent): void {
    onkeydown?.(event as Parameters<NonNullable<typeof onkeydown>>[0]);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      context.focus(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      context.focus(index + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      context.focus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      context.focus(context.length - 1);
    } else if (event.key === "Backspace") {
      event.preventDefault();
      context.delete(slot, true);
    } else if (event.key === "Delete") {
      event.preventDefault();
      context.delete(slot, false);
    }
  }

  function handleFocus(event: FocusEvent): void {
    onfocus?.(event as Parameters<NonNullable<typeof onfocus>>[0]);
    context.focus(index);
  }

  function handleBlur(event: FocusEvent): void {
    onblur?.(event as Parameters<NonNullable<typeof onblur>>[0]);
  }
</script>

{#if index === 0}
  <Slot
    {@attach inputBehavior}
    bind:ref
    bind:value={slotValue}
    aria-invalid={ariaInvalid ?? context.ariaInvalid}
    aria-label={ariaLabel}
    autocomplete={context.autocomplete}
    autocorrect="off"
    class={cn(
      "relative in-[[data-slot=otp-field][data-size=lg]]:size-10 size-9 min-w-0 rounded-lg border border-input bg-background not-dark:bg-clip-padding text-center in-[[data-slot=otp-field][data-size=lg]]:text-lg text-base text-foreground in-[[data-slot=otp-field][data-size=lg]]:leading-10 leading-9 shadow-xs/5 outline-none ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:z-10 focus-visible:border-ring focus-visible:shadow-none focus-visible:ring-[3px] focus-visible:ring-ring/24 aria-invalid:border-destructive/36 aria-invalid:shadow-none aria-invalid:focus-visible:border-destructive/64 aria-invalid:focus-visible:ring-destructive/16 sm:in-[[data-slot=otp-field][data-size=lg]]:size-9 sm:size-8 sm:in-[[data-slot=otp-field][data-size=lg]]:text-base sm:text-sm sm:in-[[data-slot=otp-field][data-size=lg]]:leading-9 sm:leading-8 dark:bg-input/32 dark:aria-invalid:focus-visible:ring-destructive/24 dark:not-focus-visible:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      className,
    )}
    data-length={context.length}
    data-slot="otp-field-input"
    disabled={context.disabled}
    enterkeyhint={context.length === 1 ? "done" : "next"}
    {id}
    inputmode={context.inputMode}
    form={context.form}
    maxlength={context.length}
    pattern={context.validationType === "numeric"
      ? "\\d{1}"
      : context.validationType === "alpha"
        ? "[A-Za-z]{1}"
        : context.validationType === "alphanumeric"
          ? "[A-Za-z0-9]{1}"
          : undefined}
    readonly={context.readonly}
    required={context.required}
    spellcheck={false}
    tabindex={context.activeIndex === index ? 0 : -1}
    type={context.mask ? "password" : "text"}
    {...explicitRelationships}
    {...props}
  />
{:else}
  <input
    {@attach inputBehavior}
    bind:this={ref}
    bind:value={slotValue}
    aria-describedby={ariaDescribedBy}
    aria-invalid={ariaInvalid ?? context.ariaInvalid}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    autocomplete="off"
    autocorrect="off"
    class={cn(
      "relative in-[[data-slot=otp-field][data-size=lg]]:size-10 size-9 min-w-0 rounded-lg border border-input bg-background not-dark:bg-clip-padding text-center in-[[data-slot=otp-field][data-size=lg]]:text-lg text-base text-foreground in-[[data-slot=otp-field][data-size=lg]]:leading-10 leading-9 shadow-xs/5 outline-none ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:z-10 focus-visible:border-ring focus-visible:shadow-none focus-visible:ring-[3px] focus-visible:ring-ring/24 aria-invalid:border-destructive/36 aria-invalid:shadow-none aria-invalid:focus-visible:border-destructive/64 aria-invalid:focus-visible:ring-destructive/16 sm:in-[[data-slot=otp-field][data-size=lg]]:size-9 sm:size-8 sm:in-[[data-slot=otp-field][data-size=lg]]:text-base sm:text-sm sm:in-[[data-slot=otp-field][data-size=lg]]:leading-9 sm:leading-8 dark:bg-input/32 dark:aria-invalid:focus-visible:ring-destructive/24 dark:not-focus-visible:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      className,
    )}
    data-length={context.length}
    data-slot="otp-field-input"
    disabled={context.disabled}
    enterkeyhint={index === context.length - 1 ? "done" : "next"}
    {id}
    inputmode={context.inputMode}
    form={context.form}
    pattern={context.validationType === "numeric"
      ? "\\d{1}"
      : context.validationType === "alpha"
        ? "[A-Za-z]{1}"
        : context.validationType === "alphanumeric"
          ? "[A-Za-z0-9]{1}"
          : undefined}
    readonly={context.readonly}
    required={context.required}
    spellcheck={false}
    tabindex={context.activeIndex === index ? 0 : -1}
    type={context.mask ? "password" : "text"}
    {...props}
  />
{/if}
