<script lang="ts">
import MenuPopup from "./menu-popup.svelte";
import type { MenuSubPopupProps } from "./menu.types.js";

let { align = "start", alignOffset, sideOffset = 0, ...props }: MenuSubPopupProps = $props();
const resolvedAlignOffset = $derived(alignOffset ?? (align === "center" ? undefined : -5));
</script>

<MenuPopup
  {align}
  alignOffset={resolvedAlignOffset}
  data-slot="menu-sub-content"
  side="inline-end"
  {sideOffset}
  {...props}
/>
