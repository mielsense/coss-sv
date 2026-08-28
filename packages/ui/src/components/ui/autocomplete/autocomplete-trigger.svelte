<script module lang="ts">
import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AutocompleteTriggerProps = ComponentProps<typeof ShardsAutocomplete.Trigger>;
</script>

<script lang="ts">
import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte";

let { children: child, ref = $bindable(null), ...props }: AutocompleteTriggerProps = $props();
</script>

{#if child}
  <AutocompletePrimitive.Trigger bind:ref data-slot="autocomplete-trigger" {...props}>
    {#snippet children(state)}
      {@render child(state)}
    {/snippet}
  </AutocompletePrimitive.Trigger>
{:else}
  <AutocompletePrimitive.Trigger bind:ref data-slot="autocomplete-trigger" {...props} />
{/if}
