<script module lang="ts">
import type { Accordion as ShardsAccordion } from "@shardsui/svelte";
import type { ComponentProps, Snippet } from "svelte";

export type AccordionRootState<Value = unknown> = {
  disabled: boolean;
  value: Value[];
};

export type AccordionRootProps<Value = unknown> = Omit<
  ComponentProps<typeof ShardsAccordion.Root>,
  "children" | "onValueChange" | "value"
> & {
  children?: Snippet<[AccordionRootState<Value>]>;
  defaultValue?: Value[];
  onValueChange?: (value: Value[]) => void;
  value?: Value[] | undefined;
};
</script>

<script lang="ts" generics="Value = unknown">
import { Accordion as AccordionPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";

let {
  defaultValue,
  ref = $bindable(null),
  value = $bindable(),
  ...props
}: AccordionRootProps<Value> = $props();

const initialValue = untrack(() => defaultValue ?? []);

function getValue(): Value[] {
  return value ?? initialValue;
}

function setValue(next: Value[]): void {
  value = next;
}
</script>

<AccordionPrimitive.Root
  bind:ref
  bind:value={getValue, setValue}
  data-slot="accordion"
  {...props}
/>
