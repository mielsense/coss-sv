<script module lang="ts">
import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxClearProps = ComponentProps<typeof ShardsCombobox.Clear>;
</script>
<script lang="ts">
import { Combobox as C } from "@shardsui/svelte";
let {
  "aria-label": ariaLabel = "Clear",
  children: child,
  ref = $bindable(null),
  ...props
}: ComboboxClearProps = $props();
</script>
<C.Clear bind:ref aria-label={ariaLabel} data-slot="combobox-clear" {...props}
  >{#snippet children(state)}
    {#if child}
      {@render child(state)}
    {:else}
      <svg
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
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    {/if}
  {/snippet}</C.Clear
>
