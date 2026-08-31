<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte/combobox";
  import type { ComponentProps } from "svelte";
  export type ComboboxClearProps = ComponentProps<typeof ShardsCombobox.Clear>;
</script>

<script lang="ts">
  import { Combobox as C } from "@shardsui/svelte/combobox";
  import { getSelectionChangeContext } from "@/selection-change-context.js";

  let { children: child, onclick, ref = $bindable(null), ...props }: ComboboxClearProps = $props();
  const change = getSelectionChangeContext();

  function handleClick(event: Parameters<NonNullable<ComboboxClearProps["onclick"]>>[0]): void {
    change?.prepare("clear-press", event);
    onclick?.(event);
  }
</script>

<C.Clear bind:ref data-slot="combobox-clear" onclick={handleClick} {...props}
  >{#snippet children(state)}
    {#if child}
      {@render child(state)}
    {/if}
  {/snippet}</C.Clear
>
