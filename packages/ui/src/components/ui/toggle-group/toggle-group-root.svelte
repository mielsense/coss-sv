<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { ToggleSize, ToggleVariant } from "../toggle/toggle-variants.js";

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
    onValueChange?: (value: Value[]) => void;
    orientation?: "horizontal" | "vertical";
    ref?: HTMLElement | null;
    size?: ToggleSize;
    value?: readonly Value[];
    variant?: ToggleVariant;
  };
</script>

<script lang="ts" generics="Value extends string = string">
  import { ToggleGroup as ToggleGroupPrimitive } from "@shardsui/svelte";
  import { setToggleGroupStyleContext } from "./context.js";
  import { toggleGroupClasses } from "./toggle-group-styles.js";

  let {
    class: className,
    defaultValue,
    disabled = false,
    loopFocus = true,
    multiple = false,
    orientation = "horizontal",
    ref = $bindable(null),
    size = "default",
    value = $bindable(defaultValue),
    variant = "default",
    ...props
  }: ToggleGroupRootProps<Value> = $props();

  const classes = $derived(toggleGroupClasses({ class: className, orientation, size, variant }));

  setToggleGroupStyleContext({
    get size() {
      return size;
    },
    get variant() {
      return variant;
    },
  });
</script>

<ToggleGroupPrimitive
  bind:ref
  bind:value
  {disabled}
  {loopFocus}
  {multiple}
  {orientation}
  data-size={size}
  data-slot="toggle-group"
  data-variant={variant}
  class={classes}
  {...props}
/>
