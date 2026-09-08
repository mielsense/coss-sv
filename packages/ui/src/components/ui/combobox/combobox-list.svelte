<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte/combobox";
  import type { ComponentProps, Snippet } from "svelte";

  type BaseProps = ComponentProps<typeof ShardsCombobox.List>;
  export type ComboboxListProps<Item = unknown> = Omit<BaseProps, "children"> &
    (
      | { item: Snippet<[Item, number]>; children?: never }
      | { item?: undefined; children?: BaseProps["children"] }
    );
</script>

<script lang="ts" generics="Item = unknown">
  import { Combobox as C } from "@shardsui/svelte/combobox";
  import ScrollArea from "../scroll-area/scroll-area.svelte";
  import Collection from "./combobox-collection.svelte";
  import { cn } from "@/utils.js";
  let {
    children: child,
    item,
    class: className,
    ref = $bindable(null),
    ...props
  }: ComboboxListProps<Item> = $props();
</script>

<ScrollArea overscrollContain scrollbarGutter scrollFade
  ><C.List
    bind:ref
    class={cn(
      "not-empty:scroll-py-1 not-empty:px-1 not-empty:py-1 in-data-has-overflow-y:pe-3",
      className,
    )}
    data-slot="combobox-list"
    {...props}
    >{#snippet children(state)}
      {#if item}
        <Collection children={item} />
      {:else}
        {@render child?.(state)}
      {/if}
    {/snippet}</C.List
  ></ScrollArea
>
