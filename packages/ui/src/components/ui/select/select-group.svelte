<script module lang="ts">
import type { Select as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type SelectGroupProps = ComponentProps<typeof P.Group>;
</script>
<script lang="ts">
import Part from "./select-parts.svelte";
let { ...props }: SelectGroupProps = $props();
</script>
<Part kind="group" {...props} />
