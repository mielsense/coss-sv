<script module lang="ts">
  import type { RadioGroup as ShardsRadioGroup } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";

  export type RadioGroupRootProps<Value = unknown> = Omit<
    ComponentProps<typeof ShardsRadioGroup>,
    "onValueChange" | "value"
  > & {
    defaultValue?: Value;
    onValueChange?: (value: Value) => void;
    value?: Value;
  };
</script>

<script lang="ts" generics="Value = unknown">
  import { RadioGroup as RadioGroupPrimitive } from "@shardsui/svelte";
  import { untrack } from "svelte";
  import { cn } from "$lib/utils.js";

  let {
    class: className,
    defaultValue,
    ref = $bindable(null),
    value = $bindable(),
    ...props
  }: RadioGroupRootProps<Value> = $props();

  const initialValue = untrack(() => defaultValue);
  const classes = $derived(cn("flex flex-col gap-3", className));

  function getValue(): Value {
    return (value === undefined ? initialValue : value) as Value;
  }

  function setValue(next: Value): void {
    value = next;
  }
</script>

<RadioGroupPrimitive
  bind:ref
  bind:value={getValue, setValue}
  data-slot="radio-group"
  class={classes}
  {...props}
/>
