<script module lang="ts">
import type { Select as ShardsSelect } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
type Base = ComponentProps<typeof ShardsSelect.Root>;
export type SelectRootProps<Value = unknown, Multiple extends boolean | undefined = false> = Omit<
  Base,
  | "isItemEqualToValue"
  | "items"
  | "itemToStringLabel"
  | "itemToStringValue"
  | "multiple"
  | "onValueChange"
  | "value"
> & {
  "aria-label"?: string;
  isItemEqualToValue?: (item: Value, value: Value) => boolean;
  items?:
    | readonly NoInfer<Value>[]
    | ReadonlyArray<{ label: unknown; value: NoInfer<Value> }>
    | readonly { items: readonly { label: unknown; value: NoInfer<Value> }[] }[]
    | Record<string, unknown>;
  itemToStringLabel?: (item: Value) => string;
  itemToStringValue?: (item: Value) => string;
  multiple?: Multiple | undefined;
  onValueChange?: (value: Multiple extends true ? Value[] : Value | null) => void;
  value?: (Multiple extends true ? Value[] : Value | null) | undefined;
};
</script>
<script lang="ts" generics="Value = unknown, Multiple extends boolean | undefined = false">
import { Select as SelectPrimitive } from "@shardsui/svelte";
import type { Component } from "svelte";
import { setSelectWrapperContext, type SelectWrapperContext } from "./context.svelte.js";
let {
  "aria-label": ariaLabel,
  children,
  multiple = false as Multiple,
  open = $bindable(false),
  value = $bindable(),
  ...props
}: SelectRootProps<Value, Multiple> = $props();
const context: SelectWrapperContext = $state({
  get ariaLabel() {
    return ariaLabel;
  },
  get open() {
    return open;
  },
  get value() {
    return value;
  },
  triggerRef: null,
});
setSelectWrapperContext(context);
const SelectRoot = SelectPrimitive.Root as unknown as Component<
  SelectRootProps<Value, Multiple>,
  object,
  "open" | "value"
>;
</script>
<SelectRoot bind:open bind:value {multiple} {...props}>{@render children?.()}</SelectRoot>
