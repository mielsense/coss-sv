<script module lang="ts">
import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxClearProps = ComponentProps<typeof ShardsCombobox.Clear>;
</script>
<script lang="ts">
import { Combobox as C } from "@shardsui/svelte";
let { children: child, ref = $bindable(null), ...props }: ComboboxClearProps = $props();
</script>
<C.Clear bind:ref data-slot="combobox-clear" {...props}
  >{#snippet children(state)}
    {#if child}
      {@render child(state)}
    {/if}
  {/snippet}</C.Clear
>
