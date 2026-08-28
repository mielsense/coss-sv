<script module lang="ts">
import type { Autocomplete as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AutocompleteEmptyProps = ComponentProps<typeof P.Empty>;
</script>
<script lang="ts">
import Part from "./autocomplete-parts.svelte";
let { ref = $bindable(null), ...props }: AutocompleteEmptyProps = $props();
</script>
<Part bind:ref kind="empty" {...props} />
