<script module lang="ts">
import type { Dialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type SheetTriggerProps = ComponentProps<typeof ShardsP.Trigger>;
</script>
<script lang="ts">
import { Dialog as P } from "@shardsui/svelte";
let { ref = $bindable(null), ...props }: SheetTriggerProps = $props();
</script>
<P.Trigger bind:ref data-slot="sheet-trigger" {...props} />
