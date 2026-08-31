<script module lang="ts">
  import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte/autocomplete";
  import type { ComponentProps } from "svelte";
  export type AutocompleteItemProps = ComponentProps<typeof ShardsAutocomplete.Item>;
</script>

<script lang="ts">
  import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte/autocomplete";
  import { getSelectionChangeContext } from "@/selection-change-context.js";
  import { cn } from "@/utils.js";
  let {
    class: className,
    onclick,
    ref = $bindable(null),
    ...props
  }: AutocompleteItemProps = $props();
  const change = getSelectionChangeContext();

  function handleClick(event: Parameters<NonNullable<AutocompleteItemProps["onclick"]>>[0]): void {
    change?.prepare("item-press", event);
    onclick?.(event);
  }
</script>

<AutocompletePrimitive.Item
  bind:ref
  class={cn(
    "flex min-h-8 cursor-default select-none items-center rounded-sm px-2 py-1 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm",
    className,
  )}
  data-slot="autocomplete-item"
  onclick={handleClick}
  {...props}
/>
