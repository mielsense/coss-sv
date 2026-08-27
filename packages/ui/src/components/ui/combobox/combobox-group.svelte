<script module lang="ts">
import type { Combobox as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxGroupProps = ComponentProps<typeof P.Group>;
</script>
<script lang="ts">
import Part from "./combobox-parts.svelte";
let { ...props }: ComboboxGroupProps = $props();
</script>
<Part kind="group" {...props} />
