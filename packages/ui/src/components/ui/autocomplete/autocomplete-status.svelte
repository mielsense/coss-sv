<script module lang="ts">
import type { Autocomplete as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AutocompleteStatusProps = ComponentProps<typeof P.Status>;
</script>
<script lang="ts">
import Part from "./autocomplete-parts.svelte";
let { ...props }: AutocompleteStatusProps = $props();
</script>
<Part kind="status" {...props} />
