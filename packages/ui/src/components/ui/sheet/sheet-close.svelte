<script module lang="ts">
import type { Dialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type SheetCloseProps = ComponentProps<typeof ShardsP.Close>;
</script>
<script lang="ts">
import { Dialog as P } from "@shardsui/svelte";
let { ref = $bindable(null), ...props }: SheetCloseProps = $props();
</script>
<P.Close bind:ref data-slot="sheet-close" {...props} />
