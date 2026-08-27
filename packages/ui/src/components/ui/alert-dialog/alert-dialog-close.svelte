<script module lang="ts">
import type { AlertDialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AlertDialogCloseProps = ComponentProps<typeof ShardsP.Close>;
</script>
<script lang="ts">
import { AlertDialog as P } from "@shardsui/svelte";
let { ref = $bindable(null), ...props }: AlertDialogCloseProps = $props();
</script>
<P.Close bind:ref data-slot="alert-dialog-close" {...props} />
