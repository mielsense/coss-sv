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
  import { type Component, untrack } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { cn } from "$lib/utils.js";
  import { getFieldRelationshipContext } from "../field/relationship-context.svelte.js";
  import { reconcileAriaRelationship } from "../field/reconcile-aria-relationship.js";
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
    "aria-roledescription": ariaRoleDescription = "Number field",
    "aria-valuemax": ariaValueMax,
    "aria-valuemin": ariaValueMin,
    "aria-valuenow": ariaValueNow,
    "aria-valuetext": ariaValueText,
    class: className,
    onblur,
    onfocus,
    oninput,
    onkeydown,
    onwheel,
    ref = $bindable(null),
    role = "spinbutton",
    ...props
  }: NumberFieldInputProps = $props();

  const context = getNumberFieldContext();
  const relationships = getFieldRelationshipContext();
  let inputValue = $state(context.displayValue);
  untrack(() => relationships?.registerInitialControlId(context.id));
  $effect(() => {
    const nextId = context.id;
    return untrack(() => relationships?.registerControlId(nextId));
  });
  const inheritedDescribedBy = $derived(
    context.ariaDescribedBy === null
      ? null
      : mergeAriaIds(context.ariaDescribedBy, relationships?.describedBy),
  );
  const computedDescribedBy = $derived(
    ariaDescribedBy !== undefined
      ? ariaDescribedBy === null
        ? null
        : inheritedDescribedBy === null
          ? mergeAriaIds(ariaDescribedBy)
          : mergeAriaIds(ariaDescribedBy, inheritedDescribedBy)
      : inheritedDescribedBy,
  );
  const inheritedLabelledBy = $derived(
    context.ariaLabelledBy !== undefined
      ? context.ariaLabelledBy
      : mergeAriaIds(relationships?.labelledBy, context.scrubLabelId),
  );
  const computedLabelledBy = $derived(
    ariaLabelledBy !== undefined ? ariaLabelledBy : inheritedLabelledBy,
  );
  const computedLabel = $derived(
    ariaLabel !== undefined
      ? ariaLabel
      : context.ariaLabel !== undefined
        ? context.ariaLabel
        : computedLabelledBy === undefined
          ? context.defaultAccessibleName
          : undefined,
  );
  const accessibilityProps = $derived.by(() => {
    const attributes: Pick<
      HTMLInputAttributes,
      | "aria-describedby"
      | "aria-invalid"
      | "aria-label"
      | "aria-labelledby"
      | "aria-valuemax"
      | "aria-valuemin"
      | "aria-valuenow"
      | "aria-valuetext"
    > & { "ARIA-DESCRIBEDBY"?: null } = {};
    const invalid = ariaInvalid !== undefined ? ariaInvalid : context.ariaInvalid;
    const valueMax = ariaValueMax !== undefined ? ariaValueMax : context.max;
    const valueMin = ariaValueMin !== undefined ? ariaValueMin : context.min;
    const valueNow = ariaValueNow !== undefined ? ariaValueNow : (context.ariaValue ?? undefined);
    const valueText =
      ariaValueText !== undefined
        ? ariaValueText
        : context.ariaValue === null
          ? undefined
          : context.displayValue;

    if (computedDescribedBy === null) {
      attributes["ARIA-DESCRIBEDBY"] = null;
    } else if (computedDescribedBy !== undefined) {
      attributes["aria-describedby"] = computedDescribedBy;
    }
    if (invalid !== undefined) attributes["aria-invalid"] = invalid;
    if (computedLabel !== undefined) attributes["aria-label"] = computedLabel;
    if (computedLabelledBy !== undefined) attributes["aria-labelledby"] = computedLabelledBy;
    if (valueMax !== undefined) attributes["aria-valuemax"] = valueMax;
    if (valueMin !== undefined) attributes["aria-valuemin"] = valueMin;
    if (valueNow !== undefined) attributes["aria-valuenow"] = valueNow;
    if (valueText !== undefined) attributes["aria-valuetext"] = valueText;
    return attributes;
  });

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
    if (!event.defaultPrevented) {
      context.setInput(target.value);
      target.value = context.displayValue;
      inputValue = context.displayValue;
    }
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
    const multiplier = event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0;
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

  function mergeAriaIds(...values: (string | null | undefined)[]): string | undefined {
    const ids = [...new Set(values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []))];
    return ids.join(" ") || undefined;
  }
</script>

<InputPrimitive
  {@attach inputBehavior}
  {@attach reconcileAriaRelationship("aria-describedby", computedDescribedBy)}
  bind:ref
  bind:value={inputValue}
  aria-roledescription={ariaRoleDescription}
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
  {role}
  spellcheck={false}
  type="text"
  {...accessibilityProps}
  {...props}
/>
