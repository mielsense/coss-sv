<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { ToggleSize, ToggleVariant } from "../toggle/toggle-variants.js";
  import type { ToggleGroupChangeEventDetails } from "./change-event-details.js";

  export type ToggleGroupRootState = {
    disabled: boolean;
    multiple: boolean;
    orientation: "horizontal" | "vertical";
  };

  export type ToggleGroupRootProps<Value extends string = string> = Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "id"
  > & {
    as?: keyof HTMLElementTagNameMap;
    children?: Snippet<[ToggleGroupRootState]>;
    defaultValue?: readonly Value[];
    disabled?: boolean;
    id?: string;
    loopFocus?: boolean;
    multiple?: boolean;
    onValueChange?: (value: Value[], eventDetails: ToggleGroupChangeEventDetails) => void;
    orientation?: "horizontal" | "vertical";
    ref?: HTMLElement | null;
    size?: ToggleSize;
    value?: readonly Value[];
    variant?: ToggleVariant;
  };
</script>

<script lang="ts" generics="Value extends string = string">
  import { ToggleGroup as ToggleGroupPrimitive } from "@shardsui/svelte/toggle-group";
  import { untrack } from "svelte";
  import { createChangeEventDetails } from "@/change-event-details.js";
  import { setToggleGroupItemChangeContext } from "../toggle/group-change-context.js";
  import { setToggleGroupStyleContext } from "./context.js";
  import { toggleGroupClasses } from "./toggle-group-styles.js";

  let {
    class: className,
    defaultValue,
    disabled = false,
    loopFocus = true,
    multiple = false,
    onValueChange,
    orientation = "horizontal",
    ref = $bindable(null),
    size = "default",
    value = $bindable(),
    variant = "default",
    ...props
  }: ToggleGroupRootProps<Value> = $props();

  const isControlled = untrack(() => value !== undefined);
  let internalValue = $state<readonly Value[]>(untrack(() => defaultValue ?? []));
  let pendingChange: { canceled: boolean; value: readonly Value[] } | undefined;
  let preparedDetails: ToggleGroupChangeEventDetails | undefined;
  const currentValue = $derived(isControlled ? (value as readonly Value[]) : internalValue);
  const classes = $derived(toggleGroupClasses({ class: className, orientation, size, variant }));

  setToggleGroupItemChangeContext({
    consume() {
      const details = preparedDetails;
      preparedDetails = undefined;
      return details;
    },
    prepare(details) {
      preparedDetails = details;
    },
  });

  setToggleGroupStyleContext({
    get size() {
      return size;
    },
    get variant() {
      return variant;
    },
  });

  function valuesEqual(left: readonly Value[], right: readonly Value[]): boolean {
    return left.length === right.length && left.every((entry, index) => entry === right[index]);
  }

  function getValue(): readonly Value[] {
    return currentValue;
  }

  function setValue(next: readonly Value[]): void {
    if (pendingChange && valuesEqual(pendingChange.value, next)) {
      const { canceled } = pendingChange;
      pendingChange = undefined;
      if (canceled) return;
    }
    if (!isControlled) internalValue = next;
    value = next;
  }

  function handleValueChange(next: Value[]): void {
    const details = preparedDetails ?? createChangeEventDetails("none");
    preparedDetails = undefined;
    if (!details.isCanceled) onValueChange?.(next, details);
    pendingChange = { canceled: details.isCanceled, value: next };
  }
</script>

<ToggleGroupPrimitive
  bind:ref
  bind:value={getValue, setValue}
  {disabled}
  {loopFocus}
  {multiple}
  onValueChange={handleValueChange}
  {orientation}
  data-size={size}
  data-slot="toggle-group"
  data-variant={variant}
  class={classes}
  {...props}
/>
