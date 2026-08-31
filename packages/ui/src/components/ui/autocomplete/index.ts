import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte/autocomplete";

export { AutocompletePrimitive };
export type {
  AutocompleteChangeEventDetails,
  AutocompleteChangeEventReason,
  AutocompleteHighlightEventDetails,
  AutocompleteRootProps,
} from "./autocomplete-root.svelte";
export {
  default as Root,
  default as Autocomplete,
  default as AutocompleteRoot,
} from "./autocomplete-root.svelte";
export const Portal: typeof AutocompletePrimitive.Portal = AutocompletePrimitive.Portal;
export const Backdrop: typeof AutocompletePrimitive.Backdrop = AutocompletePrimitive.Backdrop;
export const Positioner: typeof AutocompletePrimitive.Positioner = AutocompletePrimitive.Positioner;
export const Arrow: typeof AutocompletePrimitive.Arrow = AutocompletePrimitive.Arrow;
export const Icon: typeof AutocompletePrimitive.Icon = AutocompletePrimitive.Icon;
export const InputGroup: typeof AutocompletePrimitive.InputGroup = AutocompletePrimitive.InputGroup;
export const Value: typeof AutocompletePrimitive.Value = AutocompletePrimitive.Value;
export const AutocompleteValue: typeof AutocompletePrimitive.Value = Value;
export const Collection: typeof AutocompletePrimitive.Collection = AutocompletePrimitive.Collection;
export const AutocompleteCollection: typeof AutocompletePrimitive.Collection = Collection;
export const createFilter: typeof AutocompletePrimitive.createFilter =
  AutocompletePrimitive.createFilter;
export const useAutocompleteFilter: typeof AutocompletePrimitive.createFilter = createFilter;

export { default as Input, default as AutocompleteInput } from "./autocomplete-input.svelte";
export type { AutocompleteInputProps, AutocompleteInputSize } from "./autocomplete-input.svelte";
export { default as Trigger, default as AutocompleteTrigger } from "./autocomplete-trigger.svelte";
export type { AutocompleteTriggerProps } from "./autocomplete-trigger.svelte";
export { default as Clear, default as AutocompleteClear } from "./autocomplete-clear.svelte";
export type { AutocompleteClearProps } from "./autocomplete-clear.svelte";
export {
  default as Popup,
  default as AutocompletePopup,
  default as Content,
  default as AutocompleteContent,
} from "./autocomplete-popup.svelte";
export type { AutocompletePopupProps } from "./autocomplete-popup.svelte";
export { default as Item, default as AutocompleteItem } from "./autocomplete-item.svelte";
export type { AutocompleteItemProps } from "./autocomplete-item.svelte";
export { default as List, default as AutocompleteList } from "./autocomplete-list.svelte";
export type { AutocompleteListProps } from "./autocomplete-list.svelte";
export { default as Empty, default as AutocompleteEmpty } from "./autocomplete-empty.svelte";
export { default as Group, default as AutocompleteGroup } from "./autocomplete-group.svelte";
export {
  default as GroupLabel,
  default as AutocompleteGroupLabel,
} from "./autocomplete-group-label.svelte";
export { default as Row, default as AutocompleteRow } from "./autocomplete-row.svelte";
export {
  default as Separator,
  default as AutocompleteSeparator,
} from "./autocomplete-separator.svelte";
export { default as Status, default as AutocompleteStatus } from "./autocomplete-status.svelte";
export type { AutocompleteEmptyProps } from "./autocomplete-empty.svelte";
export type { AutocompleteGroupProps } from "./autocomplete-group.svelte";
export type { AutocompleteGroupLabelProps } from "./autocomplete-group-label.svelte";
export type { AutocompleteRowProps } from "./autocomplete-row.svelte";
export type { AutocompleteSeparatorProps } from "./autocomplete-separator.svelte";
export type { AutocompleteStatusProps } from "./autocomplete-status.svelte";
