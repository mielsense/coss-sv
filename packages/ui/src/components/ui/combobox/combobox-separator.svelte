<script module lang="ts">
import type { Combobox as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxSeparatorProps = ComponentProps<typeof P.Separator>;
</script>
<script lang="ts">
import Part from "./combobox-parts.svelte";
let { ref = $bindable(null), ...props }: ComboboxSeparatorProps = $props();
</script>
<Part bind:ref kind="separator" {...props} />
