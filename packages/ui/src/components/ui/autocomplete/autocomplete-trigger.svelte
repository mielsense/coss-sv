<script module lang="ts">
import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AutocompleteTriggerProps = ComponentProps<typeof ShardsAutocomplete.Trigger>;
</script>

<script lang="ts">
import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte";
let { children: child, ref = $bindable(null), ...props }: AutocompleteTriggerProps = $props();
</script>

<AutocompletePrimitive.Trigger bind:ref data-slot="autocomplete-trigger" {...props}>
  {#snippet children(state)}
    {#if child}
      {@render child(state)}
    {:else}
      <AutocompletePrimitive.Icon data-slot="autocomplete-icon">
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
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      </AutocompletePrimitive.Icon>
    {/if}
  {/snippet}
</AutocompletePrimitive.Trigger>
