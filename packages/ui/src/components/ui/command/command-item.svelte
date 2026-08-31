<script module lang="ts">
  import type { AutocompleteItemProps } from "../autocomplete/autocomplete-item.svelte";
  export type CommandItemProps = AutocompleteItemProps;
</script>

<script lang="ts">
  import { cn } from "@/utils.js";
  import AutocompleteItem from "../autocomplete/autocomplete-item.svelte";
  let { class: className, ref = $bindable(null), ...props }: CommandItemProps = $props();
</script>

<AutocompleteItem
  bind:ref
  class={cn(
    "flex min-h-8 cursor-default select-none items-center rounded-sm px-2 py-1 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm py-1.5",
    className,
  )}
  data-slot="command-item"
  {...props}
/>
