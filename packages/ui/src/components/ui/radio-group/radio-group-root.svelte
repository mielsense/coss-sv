<script module lang="ts">
  import type { RadioGroup as ShardsRadioGroup } from "@shardsui/svelte/radio-group";
  import type { ComponentProps } from "svelte";
  import type { ChangeEventDetails } from "@/change-event-details.js";

  export type RadioGroupChangeEventDetails = ChangeEventDetails<"none">;

  export type RadioGroupRootProps<Value = unknown> = Omit<
    ComponentProps<typeof ShardsRadioGroup>,
    "onValueChange" | "value"
  > & {
    defaultValue?: Value;
    onValueChange?: (value: Value, eventDetails: RadioGroupChangeEventDetails) => void;
    value?: Value;
  };
</script>

<script lang="ts" generics="Value = unknown">
  import { RadioGroup as RadioGroupPrimitive } from "@shardsui/svelte/radio-group";
  import { untrack } from "svelte";
  import { createChangeEventDetails } from "@/change-event-details.js";
  import { cn } from "@/utils.js";

  let {
    class: className,
    defaultValue,
    onclickcapture,
    onkeydowncapture,
    onValueChange,
    ref = $bindable(null),
    value = $bindable(),
    ...props
  }: RadioGroupRootProps<Value> = $props();

  const isControlled = untrack(() => value !== undefined);
  let internalValue = $state<Value | undefined>(untrack(() => defaultValue));
  let pendingChange: { canceled: boolean; value: Value } | undefined;
  let recordedEvent: Event | undefined;
  const currentValue = $derived(isControlled ? value : internalValue);
  const classes = $derived(cn("flex flex-col gap-3", className));

  function getValue(): Value {
    return currentValue as Value;
  }

  function setValue(next: Value): void {
    if (pendingChange && Object.is(pendingChange.value, next)) {
      const { canceled } = pendingChange;
      pendingChange = undefined;
      if (canceled) return;
    }
    if (!isControlled) internalValue = next;
    value = next;
  }

  function handleValueChange(next: Value): void {
    const event = recordedEvent;
    recordedEvent = undefined;
    const trigger = event?.target instanceof Element ? event.target : undefined;
    const details = createChangeEventDetails("none", event, trigger);
    onValueChange?.(next, details);
    pendingChange = { canceled: details.isCanceled, value: next };
  }

  function recordClick(
    event: Parameters<NonNullable<RadioGroupRootProps<Value>["onclickcapture"]>>[0],
  ): void {
    recordedEvent = event;
    onclickcapture?.(event);
  }

  function recordKeydown(
    event: Parameters<NonNullable<RadioGroupRootProps<Value>["onkeydowncapture"]>>[0],
  ): void {
    recordedEvent = event;
    onkeydowncapture?.(event);
  }
</script>

<RadioGroupPrimitive
  bind:ref
  bind:value={getValue, setValue}
  data-slot="radio-group"
  class={classes}
  onclickcapture={recordClick}
  onkeydowncapture={recordKeydown}
  onValueChange={handleValueChange}
  {...props}
/>
