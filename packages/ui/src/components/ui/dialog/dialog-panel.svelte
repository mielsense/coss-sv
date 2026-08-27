<script module lang="ts">
import type { DialogPartProps } from "./dialog-part.svelte";
export type DialogPanelProps = DialogPartProps & { scrollFade?: boolean };
</script>
<script lang="ts">
import ScrollArea from "../scroll-area/scroll-area.svelte";
import DialogPart from "./dialog-part.svelte";
let { ref = $bindable(null), scrollFade = true, ...props }: DialogPanelProps = $props();
</script>
<ScrollArea overscrollContain {scrollFade}>
  <DialogPart
    bind:ref
    baseClass="p-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-header])]:pt-1 in-[[data-slot=dialog-popup]:has([data-slot=dialog-footer]:not(.border-t))]:pb-1"
    dataSlot="dialog-panel"
    {...props}
  />
</ScrollArea>
