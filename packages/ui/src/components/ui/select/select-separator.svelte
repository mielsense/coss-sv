<script module lang="ts">
import type { Select as P } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type SelectSeparatorProps = ComponentProps<typeof P.Separator>;
</script>
<script lang="ts">
import Part from "./select-parts.svelte";
let { ref = $bindable(null), ...props }: SelectSeparatorProps = $props();
</script>
<Part bind:ref kind="separator" {...props} />
