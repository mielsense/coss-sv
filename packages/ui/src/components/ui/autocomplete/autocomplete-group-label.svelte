<script module lang="ts">
import type { Autocomplete as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AutocompleteGroupLabelProps = ComponentProps<typeof P.GroupLabel>;
</script>
<script lang="ts">
import Part from "./autocomplete-parts.svelte";
let { ...props }: AutocompleteGroupLabelProps = $props();
</script>
<Part kind="group-label" {...props} />
