<script module lang="ts">
  import type { Autocomplete as P } from "@shardsui/svelte/autocomplete";
  import type { ComponentProps } from "svelte";
  export type AutocompleteRowProps = ComponentProps<typeof P.Row>;
</script>

<script lang="ts">
  import Part from "./autocomplete-parts.svelte";
  let { ref = $bindable(null), ...props }: AutocompleteRowProps = $props();
</script>

<Part bind:ref kind="row" {...props} />
