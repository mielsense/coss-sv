<script module lang="ts">
import type { MenuPopupProps } from "./menu-popup.svelte";
export type MenuSubPopupProps = Omit<MenuPopupProps, "anchor" | "portalProps" | "side">;
</script>

<script lang="ts">
import MenuPopup from "./menu-popup.svelte";

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
