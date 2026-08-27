<script module lang="ts">
import type { Dialog as ShardsDialog } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type DialogTriggerProps = ComponentProps<typeof ShardsDialog.Trigger>;
</script>
<script lang="ts">
import { Dialog as DialogPrimitive } from "@shardsui/svelte";
let { ref = $bindable(null), ...props }: DialogTriggerProps = $props();
</script>
<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {...props} />
