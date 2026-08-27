<script module lang="ts">
import type { Autocomplete as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AutocompleteSeparatorProps = ComponentProps<typeof P.Separator>;
</script>
<script lang="ts">
import Part from "./autocomplete-parts.svelte";
let { ...props }: AutocompleteSeparatorProps = $props();
</script>
<Part kind="separator" {...props} />
