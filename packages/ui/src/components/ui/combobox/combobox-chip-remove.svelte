<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte/combobox";
  import type { ComponentProps } from "svelte";
  export type ComboboxChipRemoveProps = ComponentProps<typeof ShardsCombobox.ChipRemove>;
</script>

<script lang="ts">
  import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
  import { Combobox as C } from "@shardsui/svelte/combobox";
  import HugeiconsIcon from "@/hugeicons-icon.svelte";
  import { getSelectionChangeContext } from "@/selection-change-context.js";

  let {
    children: child,
    onclick,
    ref = $bindable(null),
    ...props
  }: ComboboxChipRemoveProps = $props();
  const change = getSelectionChangeContext();

  function handleClick(
    event: Parameters<NonNullable<ComboboxChipRemoveProps["onclick"]>>[0],
  ): void {
    change?.prepare("chip-remove-press", event);
    onclick?.(event);
  }
</script>

<C.ChipRemove
  aria-label="Remove"
  bind:ref
  class="h-full shrink-0 cursor-pointer px-1.5 opacity-80 hover:opacity-100 [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5"
  data-slot="combobox-chip-remove"
  onclick={handleClick}
  {...props}
  >{#snippet children(state)}
    {#if child}
      {@render child(state)}
    {:else}
      <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
    {/if}
  {/snippet}</C.ChipRemove
>
