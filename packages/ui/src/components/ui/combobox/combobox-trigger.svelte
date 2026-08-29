<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type ComboboxTriggerProps = ComponentProps<typeof ShardsCombobox.Trigger>;
</script>

<script lang="ts">
  import { Combobox as C } from "@shardsui/svelte";

  let { children: child, ref = $bindable(null), ...props }: ComboboxTriggerProps = $props();
</script>

{#if child}
  <C.Trigger bind:ref data-slot="combobox-trigger" {...props}>
    {#snippet children(state)}
      {@render child(state)}
    {/snippet}
  </C.Trigger>
{:else}
  <C.Trigger bind:ref data-slot="combobox-trigger" {...props} />
{/if}
