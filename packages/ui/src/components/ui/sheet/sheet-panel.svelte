<script module lang="ts">
  import type { DialogPartProps } from "../dialog/dialog-part.svelte";
  export type SheetPanelProps = DialogPartProps & { scrollFade?: boolean };
</script>

<script lang="ts">
  import ScrollArea from "../scroll-area/scroll-area.svelte";
  import DialogPart from "../dialog/dialog-part.svelte";
  let { ref = $bindable(null), scrollFade = true, ...props }: SheetPanelProps = $props();
</script>

<ScrollArea overscrollContain {scrollFade}
  ><DialogPart
    bind:ref
    baseClass="p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-header])]:pt-1 in-[[data-slot=sheet-popup]:has([data-slot=sheet-footer]:not(.border-t))]:pb-1"
    dataSlot="sheet-panel"
    {...props}
  /></ScrollArea
>
