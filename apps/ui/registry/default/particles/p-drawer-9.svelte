<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "drawer"],
  id: "p-drawer-9",
  iframeHeight: 640,
  interactive: true,
  responsive: true,
  title: "Drawer snap points",
});
</script>
<script lang="ts">
import { Drawer, buttonVariants } from "@coss-sv/ui";
const boxes = Array.from({ length: 48 }, (_, index) => `box-${index}`);
let snapPoint = $state<string | number | null>("300px");
</script>
<Drawer.Root bind:snapPoint position="bottom" snapPoints={["300px", 1]} snapToSequentialPoints>
  <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>With snap points</Drawer.Trigger>
  <Drawer.Popup showBar
    ><Drawer.Header
      ><Drawer.Title>Snap Points</Drawer.Title
      ><Drawer.Description
        >Drag the drawer to snap between a compact peek and full-height view.</Drawer.Description
      ></Drawer.Header
    ><Drawer.Panel
      ><div class="flex flex-col gap-2">
        {#each boxes as box (box)}
          <div class="h-12 shrink-0 rounded-xl border bg-muted"></div>
        {/each}
      </div></Drawer.Panel
    ></Drawer.Popup
  >
</Drawer.Root>
