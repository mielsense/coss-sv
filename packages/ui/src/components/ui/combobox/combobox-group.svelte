<script module lang="ts">
  import type { Combobox as P } from "@shardsui/svelte/combobox";
  import type { ComponentProps } from "svelte";
  export type ComboboxGroupProps = ComponentProps<typeof P.Group>;
</script>

<script lang="ts">
  import { Combobox as C } from "@shardsui/svelte/combobox";
  import { cn } from "@/utils.js";
  import { getComboboxWrapperContext } from "./context.svelte.js";
  let { ref = $bindable(null), class: className, items, ...props }: ComboboxGroupProps = $props();
  const context = getComboboxWrapperContext();
  const groupItems = $derived(context.getGroupItems(items));
</script>

<C.Group
  bind:ref
  class={cn("[[role=group]+&]:mt-1.5", className)}
  data-slot="combobox-group"
  {...groupItems === undefined ? {} : { items: groupItems }}
  {...props}
/>
