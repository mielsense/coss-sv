<script module lang="ts">
import type { AlertDialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AlertDialogTriggerProps = ComponentProps<typeof ShardsP.Trigger>;
</script>
<script lang="ts">
import { AlertDialog as P } from "@shardsui/svelte";
let { ref = $bindable(null), ...props }: AlertDialogTriggerProps = $props();
</script>
<P.Trigger bind:ref data-slot="alert-dialog-trigger" {...props} />
