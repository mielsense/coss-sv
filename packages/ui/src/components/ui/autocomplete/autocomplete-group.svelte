<script module lang="ts">
  import type { Autocomplete as P } from "@shardsui/svelte/autocomplete";
  import type { ComponentProps } from "svelte";
  export type AutocompleteGroupProps = ComponentProps<typeof P.Group>;
</script>

<script lang="ts">
  import Part from "./autocomplete-parts.svelte";
  let { ref = $bindable(null), ...props }: AutocompleteGroupProps = $props();
</script>

<Part bind:ref kind="group" {...props} />
