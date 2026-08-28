<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "drawer"],
  id: "p-drawer-6",
  iframeHeight: 640,
  interactive: true,
  responsive: true,
  title: "Scrollable drawer",
});
</script>
<script lang="ts">
import { Drawer, buttonVariants } from "@coss-sv/ui";
const boxes = Array.from({ length: 48 }, (_, index) => `box-${index}`);
</script>
<Drawer.Root
  ><Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Scrollable content</Drawer.Trigger
  ><Drawer.Popup showBar
    ><Drawer.Header><Drawer.Title>Scrollable content</Drawer.Title></Drawer.Header
    ><Drawer.Panel
      ><div class="flex flex-col gap-2">
        {#each boxes as box (box)}
          <div class="h-12 shrink-0 rounded-xl border bg-muted"></div>
        {/each}
      </div></Drawer.Panel
    ><Drawer.Footer
      ><Drawer.Close class={buttonVariants({ variant: "outline" })}
        >Close</Drawer.Close
      ></Drawer.Footer
    ></Drawer.Popup
  ></Drawer.Root
>
