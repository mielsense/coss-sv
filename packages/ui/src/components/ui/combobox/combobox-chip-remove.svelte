<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type ComboboxChipRemoveProps = ComponentProps<typeof ShardsCombobox.ChipRemove>;
</script>

<script lang="ts">
  import { Cancel01Icon } from "@hugeicons/core-free-icons";
  import { Combobox as C } from "@shardsui/svelte";
  import HugeiconsIcon from "$lib/hugeicons-icon.svelte";

  let { children: child, ref = $bindable(null), ...props }: ComboboxChipRemoveProps = $props();
</script>

<C.ChipRemove
  aria-label="Remove"
  bind:ref
  class="h-full shrink-0 cursor-pointer px-1.5 opacity-80 hover:opacity-100 [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5"
  data-slot="combobox-chip-remove"
  {...props}
  >{#snippet children(state)}
    {#if child}
      {@render child(state)}
    {:else}
      <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
    {/if}
  {/snippet}</C.ChipRemove
>
