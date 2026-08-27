<script module lang="ts">
import type { Snippet } from "svelte";

export type ComboboxValueProps<Value = unknown, Multiple extends boolean | undefined = boolean> = {
  children?: Snippet<[Multiple extends true ? Value[] : Value | null]>;
  placeholder?: string;
};
</script>

<script lang="ts" generics="Value = unknown, Multiple extends boolean | undefined = boolean">
import { Combobox as ComboboxPrimitive } from "@shardsui/svelte";

let { children, placeholder }: ComboboxValueProps<Value, Multiple> = $props();
</script>

{#if children}
  <ComboboxPrimitive.Value {...(placeholder === undefined ? {} : { placeholder })}>
    {#snippet children(value: unknown)}
      {@render children?.(value as Multiple extends true ? Value[] : Value | null)}
    {/snippet}
  </ComboboxPrimitive.Value>
{:else}
  <ComboboxPrimitive.Value {...(placeholder === undefined ? {} : { placeholder })} />
{/if}
