<script module lang="ts">
import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxChipRemoveProps = ComponentProps<typeof ShardsCombobox.ChipRemove>;
</script>
<script lang="ts">
import { Combobox as C } from "@shardsui/svelte";
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
      <svg
        aria-hidden="true"
        fill="none"
        height="24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    {/if}
  {/snippet}</C.ChipRemove
>
