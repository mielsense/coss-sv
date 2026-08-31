<script module lang="ts">
  import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte/autocomplete";
  import type { ComponentProps } from "svelte";
  export type AutocompleteListProps = ComponentProps<typeof ShardsAutocomplete.List>;
</script>

<script lang="ts">
  import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte/autocomplete";
  import ScrollArea from "../scroll-area/scroll-area.svelte";
  import { cn } from "@/utils.js";
  let {
    class: className,
    children: child,
    ref = $bindable(null),
    ...props
  }: AutocompleteListProps = $props();
</script>

<ScrollArea overscrollContain scrollbarGutter scrollFade>
  <AutocompletePrimitive.List
    bind:ref
    class={cn("not-empty:scroll-py-1 not-empty:p-1 in-data-has-overflow-y:pe-3", className)}
    data-slot="autocomplete-list"
    {...props}
  >
    {#snippet children(state)}
      {@render child?.(state)}
    {/snippet}
  </AutocompletePrimitive.List>
</ScrollArea>
