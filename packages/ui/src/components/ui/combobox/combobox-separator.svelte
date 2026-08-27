<script module lang="ts">
import type { Combobox as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxSeparatorProps = ComponentProps<typeof P.Separator>;
</script>
<script lang="ts">
import Part from "./combobox-parts.svelte";
let { ...props }: ComboboxSeparatorProps = $props();
</script>
<Part kind="separator" {...props} />
