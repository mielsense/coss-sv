<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";

  type BaseProps = ComponentProps<typeof ShardsCombobox.Root>;
  export type ComboboxRootProps<
    Value = unknown,
    Multiple extends boolean | undefined = false,
  > = Omit<
    BaseProps,
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
    | "onValueChange"
    | "value"
  > & {
    filter?:
      | null
      | ((item: Value, query: string, itemToString?: (item: Value) => string) => boolean);
    filteredItems?: readonly NoInfer<Value>[] | readonly { items: readonly NoInfer<Value>[] }[];
    inputValue?: string | undefined;
    isItemEqualToValue?: (item: Value, value: Value) => boolean;
    items?: readonly Value[] | readonly { items: readonly Value[] }[];
    itemToStringLabel?: (item: Value) => string;
    itemToStringValue?: (item: Value) => string;
    multiple?: Multiple | undefined;
    onInputValueChange?: (value: string) => void;
    onItemHighlighted?: (
      highlightedValue: Value | undefined,
      reason: "keyboard" | "none" | "pointer",
      index: number,
    ) => void;
    onValueChange?: (value: Multiple extends true ? Value[] : Value | null) => void;
    value?: (Multiple extends true ? Value[] : Value | null) | undefined;
  };
</script>

<script lang="ts" generics="Value = unknown, Multiple extends boolean | undefined = false">
  import { Combobox as ComboboxPrimitive } from "@shardsui/svelte";
  import type { Component } from "svelte";
  import { setComboboxWrapperContext } from "./context.svelte.js";

  let {
    children,
    inputValue = $bindable(),
    multiple = false as Multiple,
    open = $bindable(false),
    value = $bindable(),
    ...props
  }: ComboboxRootProps<Value, Multiple> = $props();

  const context = $state({ chipsRef: null as HTMLElement | null });
  setComboboxWrapperContext(context);
  const ComboboxRoot = ComboboxPrimitive.Root as unknown as Component<
    ComboboxRootProps<Value, Multiple>,
    object,
    "inputValue" | "open" | "value"
  >;
</script>

<ComboboxRoot bind:inputValue bind:open bind:value {multiple} {...props}>
  {@render children?.()}
</ComboboxRoot>
