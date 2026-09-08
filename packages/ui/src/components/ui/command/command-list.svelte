<script module lang="ts">
  import type { AutocompleteListProps } from "../autocomplete/autocomplete-list.svelte";
  export type CommandListProps<Item = unknown> = AutocompleteListProps<Item>;
</script>

<script lang="ts" generics="Item = unknown">
  import { cn } from "@/utils.js";
  import List from "../autocomplete/autocomplete-list.svelte";

  let { class: className, ref = $bindable(null), ...props }: CommandListProps<Item> = $props();
</script>

<List
  bind:ref
  class={cn("not-empty:scroll-py-2 not-empty:p-2", className)}
  data-slot="command-list"
  {...props}
/>
