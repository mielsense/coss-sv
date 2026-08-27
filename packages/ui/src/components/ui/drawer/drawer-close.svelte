<script module lang="ts">
import type { DialogCloseProps } from "../dialog/dialog-close.svelte";
export type DrawerCloseProps = DialogCloseProps;
</script>
<script lang="ts">
import { Dialog as P } from "@shardsui/svelte";
import type { Component } from "svelte";
const ClosePrimitive = P.Close as unknown as Component<DrawerCloseProps, object, "ref">;
let { ref = $bindable(null), ...props }: DrawerCloseProps = $props();
</script>
<ClosePrimitive bind:ref data-slot="drawer-close" {...props} />
