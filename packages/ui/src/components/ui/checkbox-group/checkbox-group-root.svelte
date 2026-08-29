<script module lang="ts">
  import type { CheckboxGroup as ShardsCheckboxGroup } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  import type { CheckboxGroupChangeEventDetails } from "./change-event-details.js";

  type ShardsCheckboxGroupProps = ComponentProps<typeof ShardsCheckboxGroup>;

  export type CheckboxGroupRootProps<Value extends string = string> = Omit<
    ShardsCheckboxGroupProps,
    "onValueChange" | "value"
  > & {
    allValues?: readonly Value[];
    defaultValue?: Value[];
    onValueChange?: (value: Value[], eventDetails: CheckboxGroupChangeEventDetails) => void;
    value?: Value[];
  };
</script>

<script lang="ts" generics="Value extends string = string">
  import { CheckboxGroup as CheckboxGroupPrimitive } from "@shardsui/svelte";
  import { untrack } from "svelte";
  import { cn } from "$lib/utils.js";
  import { createCheckboxGroupChangeEventDetails } from "./change-event-details.js";
  import { setCheckboxGroupContext } from "./context.js";

  let {
    allValues = [],
    class: className,
    defaultValue,
    disabled = false,
    onValueChange,
    ref = $bindable(null),
    value = $bindable(),
    ...props
  }: CheckboxGroupRootProps<Value> = $props();

  const uid = $props.id();
  const initialValue = untrack(() => defaultValue ?? []);
  const classes = $derived(cn("flex flex-col items-start gap-3", className));
  const itemDisabledStates = new Map<string, Set<() => boolean>>();
  let preparedChange: Event | undefined;
  let parentStatus: "mixed" | "off" | "on" = "mixed";

  function itemInputId(itemValue: string) {
    return `${uid}-${itemValue}`;
  }

  function getValue(): Value[] {
    return value ?? initialValue;
  }

  function setBoundValue(next: Value[]) {
    if (commitValue(next, "child")) parentStatus = "mixed";
  }

  function valuesEqual(left: readonly string[], right: readonly string[]): boolean {
    return left.length === right.length && left.every((entry, index) => entry === right[index]);
  }

  function commitValue(next: readonly string[], source: "child" | "parent"): boolean {
    const typedNext = [...next] as Value[];
    const details = createCheckboxGroupChangeEventDetails(preparedChange);
    preparedChange = undefined;
    onValueChange?.(typedNext, details);
    if (details.isCanceled) return false;

    value = typedNext;
    if (!valuesEqual(getValue(), typedNext)) return false;
    if (source === "child") parentStatus = "mixed";
    return true;
  }

  function prepareChange(event: Event) {
    preparedChange = event;
  }

  function clearPreparedChange(event: Event) {
    if (preparedChange === event) preparedChange = undefined;
  }

  function registerItem(itemValue: string, isDisabled: () => boolean) {
    const registrations = itemDisabledStates.get(itemValue) ?? new Set<() => boolean>();
    registrations.add(isDisabled);
    itemDisabledStates.set(itemValue, registrations);

    return () => {
      registrations.delete(isDisabled);
      if (registrations.size === 0) itemDisabledStates.delete(itemValue);
    };
  }

  function isItemDisabled(itemValue: string) {
    const registrations = itemDisabledStates.get(itemValue);
    return registrations ? Array.from(registrations).some((isDisabled) => isDisabled()) : false;
  }

  function toggleParent() {
    const current = getValue();
    const disabledChecked = allValues.filter(
      (itemValue) => isItemDisabled(itemValue) && current.includes(itemValue),
    );
    const selectableValues = allValues.filter(
      (itemValue) => !isItemDisabled(itemValue) || current.includes(itemValue),
    );
    const allOnOrOff = current.length === selectableValues.length || current.length === 0;

    let nextStatus = parentStatus;
    let nextValue: readonly string[] = current;
    if (allOnOrOff) {
      if (current.length === selectableValues.length) {
        nextStatus = "off";
        nextValue = disabledChecked;
      } else {
        nextStatus = "on";
        nextValue = selectableValues;
      }
    } else if (parentStatus === "mixed") {
      nextStatus = "on";
      nextValue = selectableValues;
    } else if (parentStatus === "on") {
      nextStatus = "off";
      nextValue = disabledChecked;
    }

    if (commitValue(nextValue, "parent")) parentStatus = nextStatus;
  }

  setCheckboxGroupContext({
    get allValues() {
      return allValues;
    },
    get disabled() {
      return disabled;
    },
    get value() {
      return getValue();
    },
    itemInputId,
    prepareChange,
    clearPreparedChange,
    registerItem,
    toggleParent,
  });
</script>

<CheckboxGroupPrimitive
  bind:ref
  bind:value={getValue, setBoundValue}
  {disabled}
  class={classes}
  {...props}
/>
