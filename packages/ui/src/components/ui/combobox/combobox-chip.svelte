<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte/combobox";
  import type { ComponentProps } from "svelte";
  export type ComboboxChipProps = ComponentProps<typeof ShardsCombobox.Chip> & {
    removeProps?: ComponentProps<typeof ShardsCombobox.ChipRemove>;
  };
</script>

<script lang="ts">
  import { Combobox as C } from "@shardsui/svelte/combobox";
  import ComboboxChipRemove from "./combobox-chip-remove.svelte";
  let {
    children: child,
    removeProps = {},
    ref = $bindable(null),
    ...props
  }: ComboboxChipProps = $props();
</script>

<C.Chip
  bind:ref
  class="flex items-center rounded-[calc(var(--radius-md)-1px)] bg-accent ps-2 font-medium text-accent-foreground text-sm outline-none sm:text-xs/(--text-xs--line-height) [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5"
  data-slot="combobox-chip"
  {...props}
  >{#snippet children(state)}
    {@render child?.(state)}<ComboboxChipRemove {...removeProps} />
  {/snippet}</C.Chip
>
