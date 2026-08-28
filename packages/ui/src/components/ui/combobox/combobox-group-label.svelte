<script module lang="ts">
import type { Combobox as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxGroupLabelProps = ComponentProps<typeof P.GroupLabel>;
</script>
<script lang="ts">
import Part from "./combobox-parts.svelte";
let { ref = $bindable(null), ...props }: ComboboxGroupLabelProps = $props();
</script>
<Part bind:ref kind="group-label" {...props} />
