<script module lang="ts">
import type { DialogPartProps } from "../dialog/dialog-part.svelte";
export type AlertDialogHeaderProps = DialogPartProps;
</script>
<script lang="ts">
import DialogPart from "../dialog/dialog-part.svelte";
let { ref = $bindable(null), ...props }: AlertDialogHeaderProps = $props();
</script>
<DialogPart
  bind:ref
  baseClass="flex flex-col gap-2 p-6 text-center max-sm:pb-4 sm:text-left"
  dataSlot="alert-dialog-header"
  {...props}
/>
