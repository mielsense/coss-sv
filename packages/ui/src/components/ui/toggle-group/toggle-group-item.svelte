<script module lang="ts">
import type { ToggleProps } from "../toggle/toggle.svelte";

export type ToggleGroupItemProps = ToggleProps;
</script>

<script lang="ts">
import Toggle from "../toggle/toggle.svelte";
import { getToggleGroupStyleContext } from "./context.js";

let {
  pressed = $bindable(false),
  ref = $bindable(null),
  size: sizeProp,
  variant: variantProp,
  ...props
}: ToggleGroupItemProps = $props();

const context = getToggleGroupStyleContext();
const size = $derived(context.size || sizeProp || "default");
const variant = $derived(context.variant || variantProp || "default");
</script>

<Toggle bind:pressed bind:ref data-size={size} data-variant={variant} {size} {variant} {...props} />
