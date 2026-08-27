<script lang="ts">
import DrawerCase from "./drawer-browser-case.svelte";
import * as Drawer from "./index.js";
const positions = ["bottom", "top", "left", "right"] as const;
</script>
{#each positions as position}
  <DrawerCase {position} />
{/each}
<Drawer.Root modal={false}
  ><Drawer.SwipeArea data-testid="edge-swipe" />
  <Drawer.Popup
    ><Drawer.Header
      ><Drawer.Title>Edge drawer</Drawer.Title
      ><Drawer.Description>Non-modal drawer.</Drawer.Description></Drawer.Header
    ></Drawer.Popup
  ></Drawer.Root
>
<style>
:global([data-slot="drawer-backdrop"]),
:global([data-slot="drawer-viewport"]) {
  position: fixed;
  inset: 0;
  z-index: 50;
}
:global([data-slot="drawer-popup"]) {
  position: relative;
  z-index: 1;
}
</style>
