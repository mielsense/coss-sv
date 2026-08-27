<script module lang="ts">
import type { Autocomplete as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AutocompleteRowProps = ComponentProps<typeof P.Row>;
</script>
<script lang="ts">
import Part from "./autocomplete-parts.svelte";
let { ...props }: AutocompleteRowProps = $props();
</script>
<Part kind="row" {...props} />
