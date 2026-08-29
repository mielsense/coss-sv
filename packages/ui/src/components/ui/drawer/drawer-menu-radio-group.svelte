<script module lang="ts">
  import type { RadioGroup as ShardsP } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type DrawerMenuRadioGroupProps<Value = unknown> = Omit<
    ComponentProps<typeof ShardsP>,
    "onValueChange" | "value"
  > & {
    defaultValue?: Value;
    onValueChange?: (value: Value) => void;
    value?: Value;
  };
</script>

<script lang="ts" generics="Value = unknown">
  import { RadioGroup as P } from "@shardsui/svelte";
  import { untrack } from "svelte";
  import { cn } from "$lib/utils.js";
  let {
    class: className,
    defaultValue,
    ref = $bindable(null),
    value = $bindable(),
    ...props
  }: DrawerMenuRadioGroupProps<Value> = $props();
  const initialValue = untrack(() => defaultValue);
  function getValue(): Value {
    return (value === undefined ? initialValue : value) as Value;
  }
  function setValue(next: Value): void {
    value = next;
  }
</script>

<P
  bind:ref
  bind:value={getValue, setValue}
  class={cn("flex flex-col", className)}
  data-slot="drawer-menu-radio-group"
  {...props}
/>
