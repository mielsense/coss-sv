<script module lang="ts">
  import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte/autocomplete";
  import type { ComponentProps } from "svelte";
  import type {
    SelectionChangeEventDetails,
    SelectionChangeEventReason,
    SelectionHighlightEventDetails,
  } from "@/change-event-details.js";

  type BaseProps = ComponentProps<typeof ShardsAutocomplete.Root>;

  export type AutocompleteChangeEventReason = SelectionChangeEventReason;
  export type AutocompleteChangeEventDetails = SelectionChangeEventDetails;
  export type AutocompleteHighlightEventDetails = SelectionHighlightEventDetails;

  export type AutocompleteRootProps<Item = unknown> = Omit<
    BaseProps,
    | "defaultOpen"
    | "defaultValue"
    | "filteredItems"
    | "filter"
    | "items"
    | "itemToStringValue"
    | "onItemHighlighted"
    | "onOpenChange"
    | "onValueChange"
    | "open"
    | "value"
  > & {
    defaultOpen?: boolean;
    defaultValue?: string;
    filter?: null | ((item: Item, query: string, itemToString?: (item: Item) => string) => boolean);
    filteredItems?: readonly Item[] | readonly { items: readonly Item[] }[];
    items?: readonly Item[] | readonly { items: readonly Item[] }[];
    itemToStringValue?: (item: Item) => string;
    onItemHighlighted?: (
      highlightedValue: Item | undefined,
      eventDetails: AutocompleteHighlightEventDetails,
    ) => void;
    onOpenChange?: (open: boolean, eventDetails: AutocompleteChangeEventDetails) => void;
    onValueChange?: (value: string, eventDetails: AutocompleteChangeEventDetails) => void;
    open?: boolean;
    value?: string;
  };

  type AutocompletePrimitiveRootProps<Item> = Omit<
    AutocompleteRootProps<Item>,
    "onItemHighlighted" | "onOpenChange" | "onValueChange"
  > & {
    onItemHighlighted?: (
      highlightedValue: Item | undefined,
      reason: "keyboard" | "none" | "pointer",
      index: number,
    ) => void;
    onOpenChange?: (open: boolean) => void;
    onValueChange?: (value: string) => void;
  };
</script>

<script lang="ts" generics="Item = unknown">
  import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte/autocomplete";
  import type { Component } from "svelte";
  import { untrack } from "svelte";
  import { createGenericEventDetails } from "@/change-event-details.js";
  import {
    createSelectionChangeContext,
    setSelectionChangeContext,
  } from "@/selection-change-context.js";

  let {
    defaultOpen = false,
    defaultValue = "",
    onItemHighlighted,
    onOpenChange,
    onValueChange,
    open = $bindable(),
    value = $bindable(),
    ...props
  }: AutocompleteRootProps<Item> = $props();

  const valueControlled = untrack(() => value !== undefined);
  const openControlled = untrack(() => open !== undefined);
  let internalValue = $state(untrack(() => defaultValue));
  let internalOpen = $state(untrack(() => defaultOpen));
  let pendingValue: { canceled: boolean; value: string } | undefined;
  let pendingOpen: { canceled: boolean; value: boolean } | undefined;
  const currentValue = $derived(valueControlled ? (value as string) : internalValue);
  const currentOpen = $derived(openControlled ? (open as boolean) : internalOpen);
  const change = createSelectionChangeContext();
  setSelectionChangeContext(change);

  const AutocompleteRoot = AutocompletePrimitive.Root as unknown as Component<
    AutocompletePrimitiveRootProps<Item>,
    object,
    "open" | "value"
  >;

  function getValue(): string {
    return currentValue;
  }

  function setValue(next: string): void {
    if (pendingValue?.value === next) {
      const { canceled } = pendingValue;
      pendingValue = undefined;
      if (canceled) return;
    }
    if (!valueControlled) internalValue = next;
    value = next;
  }

  function handleValueChange(next: string): void {
    const details = change.details("input-change");
    onValueChange?.(next, details);
    pendingValue = { canceled: details.isCanceled, value: next };
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
    highlightedValue: Item | undefined,
    reason: "keyboard" | "none" | "pointer",
    index: number,
  ): void {
    onItemHighlighted?.(highlightedValue, createGenericEventDetails(reason, undefined, { index }));
  }
</script>

<AutocompleteRoot
  bind:open={getOpen, setOpen}
  bind:value={getValue, setValue}
  onItemHighlighted={handleItemHighlighted}
  onOpenChange={handleOpenChange}
  onValueChange={handleValueChange}
  {...props}
/>
