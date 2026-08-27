<script lang="ts">
import DrawerCase from "./drawer-browser-case.svelte";
import * as Drawer from "./index.js";
const positions = ["bottom", "top", "left", "right"] as const;
const detached = Drawer.createHandle<{ label: string }>();
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
<Drawer.Root>
  <Drawer.Trigger>Open menu defaults</Drawer.Trigger>
  <Drawer.Popup>
    <Drawer.Title>Menu defaults</Drawer.Title>
    <Drawer.Description>Default menu state.</Drawer.Description>
    <Drawer.Menu>
      <Drawer.MenuCheckboxItem defaultChecked>Shuffle</Drawer.MenuCheckboxItem>
      <Drawer.MenuRadioGroup aria-label="Sort by" defaultValue="artist">
        <Drawer.MenuRadioItem value="artist">Artist</Drawer.MenuRadioItem>
        <Drawer.MenuRadioItem value="album">Album</Drawer.MenuRadioItem>
      </Drawer.MenuRadioGroup>
    </Drawer.Menu>
  </Drawer.Popup>
</Drawer.Root>
<Drawer.Trigger handle={detached} payload={{ label: "Detached drawer payload" }}>
  Open detached drawer
</Drawer.Trigger>
<Drawer.Root handle={detached}>
  {#snippet children({ payload })}
    <Drawer.Popup>
      <Drawer.Title>Detached drawer</Drawer.Title>
      <Drawer.Description>{payload?.label}</Drawer.Description>
      <Drawer.Close>Close detached drawer</Drawer.Close>
    </Drawer.Popup>
  {/snippet}
</Drawer.Root>
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
