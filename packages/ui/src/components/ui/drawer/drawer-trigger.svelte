<script module lang="ts">
import type { Dialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type DrawerTriggerProps = ComponentProps<typeof ShardsP.Trigger>;
</script>
<script lang="ts">
import { Dialog as P } from "@shardsui/svelte";
let { ref = $bindable(null), ...props }: DrawerTriggerProps = $props();
</script>
<P.Trigger bind:ref data-slot="drawer-trigger" {...props} />
