<script module lang="ts">
import type { DialogPartProps } from "./dialog-part.svelte";
export type DialogHeaderProps = DialogPartProps;
</script>
<script lang="ts">
import DialogPart from "./dialog-part.svelte";
let { ref = $bindable(null), ...props }: DialogHeaderProps = $props();
</script>
<DialogPart
  bind:ref
  baseClass="flex flex-col gap-2 p-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pb-3 max-sm:pb-4"
  dataSlot="dialog-header"
  {...props}
/>
