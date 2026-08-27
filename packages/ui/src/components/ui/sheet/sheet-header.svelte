<script module lang="ts">
import type { DialogPartProps } from "../dialog/dialog-part.svelte";
export type SheetHeaderProps = DialogPartProps;
</script>
<script lang="ts">
import DialogPart from "../dialog/dialog-part.svelte";
let { ref = $bindable(null), ...props }: SheetHeaderProps = $props();
</script>
<DialogPart
  bind:ref
  baseClass="flex flex-col gap-2 p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pb-3 max-sm:pb-4"
  dataSlot="sheet-header"
  {...props}
/>
