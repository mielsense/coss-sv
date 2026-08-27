<script module lang="ts">
import type { Autocomplete as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AutocompleteGroupProps = ComponentProps<typeof P.Group>;
</script>
<script lang="ts">
import Part from "./autocomplete-parts.svelte";
let { ...props }: AutocompleteGroupProps = $props();
</script>
<Part kind="group" {...props} />
