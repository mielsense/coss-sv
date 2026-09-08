<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte/combobox";
  import type { ComponentProps } from "svelte";
  import type {
    SelectionChangeEventDetails,
    SelectionChangeEventReason,
    SelectionHighlightEventDetails,
  } from "@/change-event-details.js";

  type BaseProps = ComponentProps<typeof ShardsCombobox.Root>;
  export type ComboboxChangeEventReason = SelectionChangeEventReason;
  export type ComboboxChangeEventDetails = SelectionChangeEventDetails;
  export type ComboboxHighlightEventDetails = SelectionHighlightEventDetails;
  export type ComboboxValue<Value, Multiple extends boolean | undefined> = Multiple extends true
    ? Value[]
    : Value | null;

  export type ComboboxRootProps<
    Value = unknown,
    Multiple extends boolean | undefined = false,
  > = Omit<
    BaseProps,
    | "defaultInputValue"
    | "defaultOpen"
    | "defaultValue"
    | "filter"
    | "filteredItems"
    | "inputValue"
    | "isItemEqualToValue"
    | "items"
    | "itemToStringLabel"
    | "itemToStringValue"
    | "multiple"
    | "onInputValueChange"
    | "onItemHighlighted"
    | "onOpenChange"
    | "onValueChange"
    | "open"
    | "value"
  > & {
    defaultInputValue?: string;
    defaultOpen?: boolean;
    defaultValue?: ComboboxValue<Value, Multiple> | null;
    filter?:
      | null
      | ((item: Value, query: string, itemToString?: (item: Value) => string) => boolean);
    filteredItems?: readonly NoInfer<Value>[] | readonly { items: readonly NoInfer<Value>[] }[];
    inputValue?: string | undefined;
    isItemEqualToValue?: ((item: Value, value: Value) => boolean) | undefined;
    items?: readonly Value[] | readonly { items: readonly Value[] }[] | undefined;
    itemToStringLabel?: ((item: Value) => string) | undefined;
    itemToStringValue?: ((item: Value) => string) | undefined;
    multiple?: Multiple | undefined;
    onInputValueChange?: (value: string, eventDetails: ComboboxChangeEventDetails) => void;
    onItemHighlighted?: (
      highlightedValue: Value | undefined,
      eventDetails: ComboboxHighlightEventDetails,
    ) => void;
    onOpenChange?: (open: boolean, eventDetails: ComboboxChangeEventDetails) => void;
    onValueChange?: (
      value: ComboboxValue<Value, Multiple>,
      eventDetails: ComboboxChangeEventDetails,
    ) => void;
    open?: boolean | undefined;
    value?: ComboboxValue<Value, Multiple> | null | undefined;
  };

  type ComboboxPrimitiveRootProps<Value, Multiple extends boolean | undefined> = Omit<
    ComboboxRootProps<Value, Multiple>,
    "onInputValueChange" | "onItemHighlighted" | "onOpenChange" | "onValueChange"
  > & {
    onInputValueChange?: (value: string) => void;
    onItemHighlighted?: (
      highlightedValue: Value | undefined,
      reason: "keyboard" | "none" | "pointer",
      index: number,
    ) => void;
    onOpenChange?: (open: boolean) => void;
    onValueChange?: (value: ComboboxValue<Value, Multiple> | null) => void;
  };
</script>

<script lang="ts" generics="Value = unknown, Multiple extends boolean | undefined = false">
  import { Combobox as ComboboxPrimitive } from "@shardsui/svelte/combobox";
  import type { Component } from "svelte";
  import { untrack } from "svelte";
  import { createChangeEventDetails, createGenericEventDetails } from "@/change-event-details.js";
  import {
    areSelectionValuesEqual,
    canonicalizeComboboxSelectionValue,
    canonicalizeComboboxSelectionValues,
    createSelectionChangeContext,
    setSelectionChangeContext,
  } from "@/selection-change-context.js";
  import { setComboboxInputPlacementContext, setComboboxWrapperContext } from "./context.svelte.js";

  let {
    children,
    defaultInputValue,
    defaultOpen = false,
    defaultValue,
    inputValue = $bindable(),
    isItemEqualToValue,
    items,
    itemToStringLabel,
    itemToStringValue,
    multiple = false as Multiple,
    onInputValueChange,
    onItemHighlighted,
    onOpenChange,
    onValueChange,
    open = $bindable(),
    value = $bindable(),
    ...props
  }: ComboboxRootProps<Value, Multiple> = $props();

  const valueControlled = untrack(() => value !== undefined);
  const inputControlled = untrack(() => inputValue !== undefined);
  const openControlled = untrack(() => open !== undefined);
  let internalValue = $state.raw<ComboboxValue<Value, Multiple>>(
    untrack(() => defaultValue ?? ((multiple ? [] : null) as ComboboxValue<Value, Multiple>)),
  );
  let internalInputValue = $state(untrack(() => defaultInputValue ?? ""));
  let lastWrittenInput = untrack(() => inputValue);
  let inputExternallyControlled = inputControlled;
  const hasDefaultInputValue = untrack(() => defaultInputValue !== undefined);
  let internalOpen = $state(untrack(() => defaultOpen));
  let pendingValue: { canceled: boolean; value: ComboboxValue<Value, Multiple> } | undefined;
  let canceledInputEvent: Event | undefined;
  let pendingInput: { canceled: boolean; value: string } | undefined;
  let pendingOpen: { canceled: boolean; value: boolean } | undefined;
  const currentValue = $derived(value !== undefined ? value : internalValue);
  const currentInputValue = $derived(inputValue !== undefined ? inputValue : internalInputValue);
  const currentOpen = $derived(open !== undefined ? open : internalOpen);
  const change = createSelectionChangeContext();
  setSelectionChangeContext(change);

  const initialInput = untrack(() => inputValue ?? defaultInputValue);
  const initialSelectedLabel = untrack(() => (multiple ? "" : selectedInputLabel(currentValue)));
  const context = $state({
    chipsRef: null as HTMLElement | null,
    inputInsidePopup: true,
    getInitialInputValue(insidePopup: boolean) {
      return initialInput ?? (insidePopup ? "" : initialSelectedLabel);
    },
  });
  setComboboxWrapperContext(context);
  setComboboxInputPlacementContext({
    get insidePopup() {
      return props.inline ?? false;
    },
  });

  function selectedInputLabel(selected: unknown): string {
    if (selected == null) return "";
    if (itemToStringLabel) return itemToStringLabel(selected as Value) ?? "";
    if (typeof selected === "object") {
      if ("label" in selected && selected.label != null) return String(selected.label);
      if ("value" in selected) return String(selected.value);
    }
    if (typeof selected === "string") return selected;
    try {
      return JSON.stringify(selected) ?? "";
    } catch {
      return String(selected);
    }
  }

  let previousSelection = untrack(() => currentValue);
  let previousLabel = untrack(() => (multiple ? "" : selectedInputLabel(currentValue)));
  let wasOutside = false;
  // Selection and editable search text are separate primitive states. Reconcile only
  // a changed selection outside the popup; typing alone must retain its query.
  $effect(() => {
    const selected = currentValue;
    const label = multiple ? "" : selectedInputLabel(selected);
    const outside = !context.inputInsidePopup && !multiple;
    if (inputValue !== lastWrittenInput) inputExternallyControlled = true;
    const changed = !Object.is(previousSelection, selected) || previousLabel !== label;
    const initialize = outside && !wasOutside && !hasDefaultInputValue;
    previousSelection = selected;
    previousLabel = label;
    wasOutside = outside;
    if (!outside || inputExternallyControlled || (!changed && !initialize)) return;
    untrack(() => {
      if (currentInputValue === label) return;
      if (!initialize || changed) {
        const details = createChangeEventDetails("none");
        onInputValueChange?.(label, details);
        if (details.isCanceled) return;
      }
      internalInputValue = label;
      lastWrittenInput = label;
      inputValue = label;
    });
  });
  const ComboboxRoot = ComboboxPrimitive.Root as unknown as Component<
    ComboboxPrimitiveRootProps<Value, Multiple>,
    object,
    "inputValue" | "open" | "value"
  >;

  function getValue(): ComboboxValue<Value, Multiple> | null {
    return currentValue;
  }

  function canonicalize(
    next: ComboboxValue<Value, Multiple> | null,
  ): ComboboxValue<Value, Multiple> {
    if (multiple) {
      if (!Array.isArray(next)) return [] as ComboboxValue<Value, Multiple>;
      return canonicalizeComboboxSelectionValues(
        next as Value[],
        items,
        isItemEqualToValue,
      ) as ComboboxValue<Value, Multiple>;
    }
    return next === null
      ? (next as ComboboxValue<Value, Multiple>)
      : (canonicalizeComboboxSelectionValue(
          next as Value,
          items,
          isItemEqualToValue,
        ) as ComboboxValue<Value, Multiple>);
  }

  function setValue(next: ComboboxValue<Value, Multiple> | null): void {
    const canonicalValue = canonicalize(next);
    if (pendingValue && areSelectionValuesEqual(pendingValue.value, canonicalValue)) {
      const { canceled } = pendingValue;
      pendingValue = undefined;
      if (canceled) return;
    }
    if (!valueControlled) internalValue = canonicalValue;
    value = canonicalValue;
  }

  function handleValueChange(next: ComboboxValue<Value, Multiple> | null): void {
    const canonicalValue = canonicalize(next);
    const details = change.details();
    if (canceledInputEvent === details.event) {
      pendingValue = { canceled: true, value: canonicalValue };
      return;
    }
    onValueChange?.(canonicalValue, details);
    pendingValue = { canceled: details.isCanceled, value: canonicalValue };
  }

  function getInputValue(): string {
    return currentInputValue;
  }

  function setInputValue(next: string): void {
    if (pendingInput?.value === next) {
      const { canceled } = pendingInput;
      pendingInput = undefined;
      if (canceled) return;
    }
    if (inputValue !== lastWrittenInput) inputExternallyControlled = true;
    if (!inputControlled) internalInputValue = next;
    lastWrittenInput = next;
    inputValue = next;
  }

  function handleInputValueChange(next: string): void {
    const details = change.details("input-change");
    onInputValueChange?.(next, details);
    if (details.isCanceled) {
      canceledInputEvent = details.event;
      queueMicrotask(() => {
        if (canceledInputEvent === details.event) canceledInputEvent = undefined;
      });
      const target = details.event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        target.value = currentInputValue;
      }
    }
    pendingInput = { canceled: details.isCanceled, value: next };
  }

  function getOpen(): boolean {
    return currentOpen;
  }

  function setOpen(next: boolean): void {
    if (pendingOpen?.value === next) {
      const { canceled } = pendingOpen;
      pendingOpen = undefined;
      if (canceled) return;
    }
    if (!openControlled) internalOpen = next;
    open = next;
  }

  function handleOpenChange(next: boolean): void {
    const details = change.details();
    onOpenChange?.(next, details);
    pendingOpen = { canceled: details.isCanceled, value: next };
  }

  function handleItemHighlighted(
    highlightedValue: Value | undefined,
    reason: "keyboard" | "none" | "pointer",
    index: number,
  ): void {
    onItemHighlighted?.(highlightedValue, createGenericEventDetails(reason, undefined, { index }));
  }
</script>

<ComboboxRoot
  bind:inputValue={getInputValue, setInputValue}
  bind:open={getOpen, setOpen}
  bind:value={getValue, setValue}
  {isItemEqualToValue}
  {items}
  {itemToStringLabel}
  {itemToStringValue}
  {multiple}
  onInputValueChange={handleInputValueChange}
  onItemHighlighted={handleItemHighlighted}
  onOpenChange={handleOpenChange}
  onValueChange={handleValueChange}
  {...props}
>
  {@render children?.()}
</ComboboxRoot>
