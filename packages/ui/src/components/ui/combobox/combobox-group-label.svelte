<script module lang="ts">
import type { Combobox as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxGroupLabelProps = ComponentProps<typeof P.GroupLabel>;
</script>
<script lang="ts">
import Part from "./combobox-parts.svelte";
let { ...props }: ComboboxGroupLabelProps = $props();
</script>
<Part kind="group-label" {...props} />
