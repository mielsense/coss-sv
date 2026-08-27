<script module lang="ts">
import type { Select as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type SelectGroupLabelProps = ComponentProps<typeof P.GroupLabel>;
</script>
<script lang="ts">
import Part from "./select-parts.svelte";
let { ...props }: SelectGroupLabelProps = $props();
</script>
<Part kind="group-label" {...props} />
