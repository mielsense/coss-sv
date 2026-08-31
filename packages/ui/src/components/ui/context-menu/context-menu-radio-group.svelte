<script module lang="ts">
  import type { ContextMenu as ShardsContextMenu } from "@shardsui/svelte/context-menu";
  import type { ComponentProps } from "svelte";
  export type ContextMenuRadioGroupProps<Value = unknown> = Omit<
    ComponentProps<typeof ShardsContextMenu.RadioGroup>,
    "onValueChange" | "value"
  > & { defaultValue?: Value; onValueChange?: (value: Value) => void; value?: Value };
</script>

<script lang="ts" generics="Value = unknown">
  import { ContextMenu as P } from "@shardsui/svelte/context-menu";
  import { type Component, untrack } from "svelte";

  const RadioGroupPrimitive = P.RadioGroup as Component<
    Record<string, unknown>,
    object,
    "ref" | "value"
  >;
  let {
    defaultValue,
    onValueChange,
    ref = $bindable(null),
    value = $bindable(),
    ...props
  }: ContextMenuRadioGroupProps<Value> = $props();
  const initialValue = untrack(() => defaultValue);
  const callbackProps = $derived(onValueChange ? { onValueChange } : {});
  function getValue(): Value | undefined {
    return value === undefined ? initialValue : value;
  }
  function setValue(next: unknown): void {
    value = next as Value;
  }
</script>

<RadioGroupPrimitive
  bind:ref
  bind:value={getValue, setValue}
  data-slot="context-menu-radio-group"
  {...callbackProps}
  {...props}
/>
