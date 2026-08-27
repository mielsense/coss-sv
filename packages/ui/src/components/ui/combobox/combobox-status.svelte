<script module lang="ts">
import type { Combobox as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxStatusProps = ComponentProps<typeof P.Status>;
</script>
<script lang="ts">
import Part from "./combobox-parts.svelte";
let { ...props }: ComboboxStatusProps = $props();
</script>
<Part kind="status" {...props} />
