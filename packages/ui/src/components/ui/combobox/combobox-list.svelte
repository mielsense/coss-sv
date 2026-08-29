<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type ComboboxListProps = ComponentProps<typeof ShardsCombobox.List>;
</script>

<script lang="ts">
  import { Combobox as C } from "@shardsui/svelte";
  import ScrollArea from "../scroll-area/scroll-area.svelte";
  import { cn } from "$lib/utils.js";
  let {
    children: child,
    class: className,
    ref = $bindable(null),
    ...props
  }: ComboboxListProps = $props();
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
      {@render child?.(state)}
    {/snippet}</C.List
  ></ScrollArea
>
