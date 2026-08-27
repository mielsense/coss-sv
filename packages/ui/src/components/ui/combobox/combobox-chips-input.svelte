<script module lang="ts">
import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxChipsInputProps = Omit<ComponentProps<typeof ShardsCombobox.Input>, "size"> & {
  size?: "sm" | "default" | "lg" | number;
};
</script>
<script lang="ts">
import { Combobox as C } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let {
  class: className,
  ref = $bindable(null),
  size = "default",
  ...props
}: ComboboxChipsInputProps = $props();
const nativeSize = $derived(typeof size === "number" ? size : undefined);
</script>
<C.Input
  bind:ref
  class={cn("min-w-12 flex-1 text-base text-foreground outline-none sm:text-sm [[data-slot=combobox-chip]+&]:ps-0.5", size === "sm" ? "ps-1.5" : "ps-2", className)}
  data-size={typeof size === "string" ? size : undefined}
  data-slot="combobox-chips-input"
  size={nativeSize}
  {...props}
/>
