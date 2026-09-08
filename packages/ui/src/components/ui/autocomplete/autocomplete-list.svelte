<script module lang="ts">
  import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte/autocomplete";
  import type { ComponentProps, Snippet } from "svelte";

  type BaseProps = ComponentProps<typeof ShardsAutocomplete.List>;
  export type AutocompleteListProps<Item = unknown> = Omit<BaseProps, "children"> &
    (
      | { item: Snippet<[Item, number]>; children?: never }
      | { item?: undefined; children?: BaseProps["children"] }
    );
</script>

<script lang="ts" generics="Item = unknown">
  import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte/autocomplete";
  import { cn } from "@/utils.js";
  import ScrollArea from "../scroll-area/scroll-area.svelte";

  let {
    class: className,
    children: child,
    item,
    ref = $bindable(null),
    ...props
  }: AutocompleteListProps<Item> = $props();
</script>

<ScrollArea overscrollContain scrollbarGutter scrollFade>
  <AutocompletePrimitive.List
    bind:ref
    class={cn("not-empty:scroll-py-1 not-empty:p-1 in-data-has-overflow-y:pe-3", className)}
    data-slot="autocomplete-list"
    {...props}
  >
    {#snippet children(state)}
      {#if item}
        <AutocompletePrimitive.Collection children={item} />
      {:else}
        {@render child?.(state)}
      {/if}
    {/snippet}
  </AutocompletePrimitive.List>
</ScrollArea>
