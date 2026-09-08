<script module lang="ts">
  import type { Snippet } from "svelte";
  export type ComboboxCollectionProps<Item = unknown> = {
    children?: Snippet<[Item, number]>;
  };
</script>

<script lang="ts" generics="Item = unknown">
  import { Combobox as C } from "@shardsui/svelte/combobox";
  import { getComboboxWrapperContext } from "./context.svelte.js";
  let { children: child }: ComboboxCollectionProps<Item> = $props();
  const context = getComboboxWrapperContext();
</script>

<C.Collection>
  {#snippet children(item: unknown, index)}
    {@render child?.(context.getCollectionItem(item) as Item, index)}
  {/snippet}
</C.Collection>
