<script module lang="ts">
import type { DialogPartProps } from "../dialog/dialog-part.svelte";
export type DrawerPartProps = DialogPartProps;
</script>
<script lang="ts">
import DialogPart from "../dialog/dialog-part.svelte";
let { ref = $bindable(null), ...props }: DrawerPartProps & { baseClass: string; dataSlot: string } =
  $props();
</script>
<DialogPart bind:ref {...props} />
