<script module lang="ts">
  import type { Autocomplete as P } from "@shardsui/svelte/autocomplete";
  import type { ComponentProps } from "svelte";
  export type AutocompleteGroupLabelProps = ComponentProps<typeof P.GroupLabel>;
</script>

<script lang="ts">
  import Part from "./autocomplete-parts.svelte";
  let { ref = $bindable(null), ...props }: AutocompleteGroupLabelProps = $props();
</script>

<Part bind:ref kind="group-label" {...props} />
