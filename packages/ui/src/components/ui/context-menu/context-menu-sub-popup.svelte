<script lang="ts">
  import ContextMenuPopup from "./context-menu-popup.svelte";
  import type { ContextMenuSubPopupProps } from "./context-menu.types.js";

  let {
    ref = $bindable(null),
    align = "start",
    alignOffset,
    sideOffset = 0,
    ...props
  }: ContextMenuSubPopupProps = $props();
  const resolvedAlignOffset = $derived(alignOffset ?? (align === "center" ? undefined : -5));
</script>

<ContextMenuPopup
  bind:ref
  {align}
  alignOffset={resolvedAlignOffset}
  data-slot="context-menu-sub-content"
  side="inline-end"
  {sideOffset}
  {...props}
/>
