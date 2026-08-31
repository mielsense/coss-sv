<script module lang="ts">
  import type { Snippet } from "svelte";

  export type ComboboxValueProps<Value = unknown, Multiple extends boolean | undefined = false> = {
    children?: Snippet<[Multiple extends true ? Value[] : Value | null]>;
    placeholder?: string;
  };
</script>

<script lang="ts" generics="Value = unknown, Multiple extends boolean | undefined = false">
  import { Combobox as ComboboxPrimitive } from "@shardsui/svelte/combobox";

  let { children: child, placeholder }: ComboboxValueProps<Value, Multiple> = $props();
</script>

{#if child}
  <ComboboxPrimitive.Value {...placeholder === undefined ? {} : { placeholder }}>
    {#snippet children(value: unknown)}
      {@render child(value as Multiple extends true ? Value[] : Value | null)}
    {/snippet}
  </ComboboxPrimitive.Value>
{:else}
  <ComboboxPrimitive.Value {...placeholder === undefined ? {} : { placeholder }} />
{/if}
