<script module lang="ts">
import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AutocompleteItemProps = ComponentProps<typeof ShardsAutocomplete.Item>;
</script>
<script lang="ts">
import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, ref = $bindable(null), ...props }: AutocompleteItemProps = $props();
</script>
<AutocompletePrimitive.Item
  bind:ref
  class={cn("flex min-h-8 cursor-default select-none items-center rounded-sm px-2 py-1 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm", className)}
  data-slot="autocomplete-item"
  {...props}
/>
