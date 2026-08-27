<script module lang="ts">
import type { DialogCloseProps } from "../dialog/dialog-close.svelte";
export type SheetCloseProps = DialogCloseProps;
</script>
<script lang="ts">
import { Dialog as P } from "@shardsui/svelte";
import type { Component } from "svelte";
const ClosePrimitive = P.Close as unknown as Component<SheetCloseProps, object, "ref">;
let { ref = $bindable(null), ...props }: SheetCloseProps = $props();
</script>
<ClosePrimitive bind:ref data-slot="sheet-close" {...props} />
