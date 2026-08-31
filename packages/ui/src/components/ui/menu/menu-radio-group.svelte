<script module lang="ts">
  import type { Menu as ShardsMenu } from "@shardsui/svelte/menu";
  import type { ComponentProps } from "svelte";

  export type MenuRadioGroupProps<Value = unknown> = Omit<
    ComponentProps<typeof ShardsMenu.RadioGroup>,
    "onValueChange" | "value"
  > & {
    defaultValue?: Value;
    onValueChange?: (value: Value) => void;
    value?: Value;
  };
</script>

<script lang="ts" generics="Value = unknown">
  import { Menu as MenuPrimitive } from "@shardsui/svelte/menu";
  import { type Component, untrack } from "svelte";

  const RadioGroupPrimitive = MenuPrimitive.RadioGroup as Component<
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
  }: MenuRadioGroupProps<Value> = $props();

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
  data-slot="menu-radio-group"
  {...callbackProps}
  {...props}
/>
