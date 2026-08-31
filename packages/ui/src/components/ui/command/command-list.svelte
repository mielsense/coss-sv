<script module lang="ts">
  import type { AutocompleteListProps } from "../autocomplete/autocomplete-list.svelte";
  export type CommandListProps = AutocompleteListProps;
</script>

<script lang="ts">
  import { cn } from "@/utils.js";
  import List from "../autocomplete/autocomplete-list.svelte";
  let { class: className, ...props }: CommandListProps = $props();
</script>

<List
  class={cn("not-empty:scroll-py-2 not-empty:p-2", className)}
  data-slot="command-list"
  {...props}
/>
