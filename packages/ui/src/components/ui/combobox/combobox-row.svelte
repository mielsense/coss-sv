<script module lang="ts">
import type { Combobox as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxRowProps = ComponentProps<typeof P.Row>;
</script>
<script lang="ts">
import Part from "./combobox-parts.svelte";
let { ...props }: ComboboxRowProps = $props();
</script>
<Part kind="row" {...props} />
