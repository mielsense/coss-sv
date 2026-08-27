<script module lang="ts">
import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxTriggerProps = ComponentProps<typeof ShardsCombobox.Trigger>;
</script>
<script lang="ts">
import { Combobox as C } from "@shardsui/svelte";
let { children: child, ref = $bindable(null), ...props }: ComboboxTriggerProps = $props();
</script>
<C.Trigger bind:ref data-slot="combobox-trigger" {...props}
  >{#snippet children(state)}
    {#if child}
      {@render child(state)}
    {:else}
      <C.Icon data-slot="combobox-icon"
        ><svg
          aria-hidden="true"
          fill="none"
          height="24"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg></C.Icon
      >
    {/if}
  {/snippet}</C.Trigger
>
