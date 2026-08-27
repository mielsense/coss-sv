<script module lang="ts">
import type { ContextMenuPopupProps } from "./context-menu-popup.svelte";
export type ContextMenuSubPopupProps = Omit<
  ContextMenuPopupProps,
  "anchor" | "portalProps" | "side"
>;
</script>
<script lang="ts">
import ContextMenuPopup from "./context-menu-popup.svelte";

let { align = "start", alignOffset, sideOffset = 0, ...props }: ContextMenuSubPopupProps = $props();
const resolvedAlignOffset = $derived(alignOffset ?? (align === "center" ? undefined : -5));
</script>
<ContextMenuPopup
  {align}
  alignOffset={resolvedAlignOffset}
  data-slot="context-menu-sub-content"
  side="inline-end"
  {sideOffset}
  {...props}
/>
