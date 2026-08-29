<script lang="ts">
  import * as Drawer from "./index.js";
  const positions = ["bottom", "top", "left", "right"] as const;
</script>

{#each positions as position}
  <Drawer.Root open {position}>
    <Drawer.Popup
      data-position={position}
      showBar={position === "bottom"}
      variant={position === "right" ? "inset" : "default"}
    >
      <Drawer.Header
        ><Drawer.Title>{position}</Drawer.Title><Drawer.Description
          >{position} drawer</Drawer.Description
        ></Drawer.Header
      >
      <Drawer.Panel>Panel</Drawer.Panel>
      <Drawer.Footer><Drawer.Close>Close</Drawer.Close></Drawer.Footer>
    </Drawer.Popup>
  </Drawer.Root>
{/each}
