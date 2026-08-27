<script module lang="ts">
import type { Dialog as ShardsDialog } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type DialogCloseProps = ComponentProps<typeof ShardsDialog.Close>;
</script>
<script lang="ts">
import { Dialog as DialogPrimitive } from "@shardsui/svelte";
let { ref = $bindable(null), ...props }: DialogCloseProps = $props();
</script>
<DialogPrimitive.Close bind:ref data-slot="dialog-close" {...props} />
