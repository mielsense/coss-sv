<script module lang="ts">
import type { DialogCloseProps } from "../dialog/dialog-close.svelte";
export type AlertDialogCloseProps = DialogCloseProps;
</script>
<script lang="ts">
import { AlertDialog as P } from "@shardsui/svelte";
import type { Component } from "svelte";
const ClosePrimitive = P.Close as unknown as Component<AlertDialogCloseProps, object, "ref">;
let { ref = $bindable(null), ...props }: AlertDialogCloseProps = $props();
</script>
<ClosePrimitive bind:ref data-slot="alert-dialog-close" {...props} />
