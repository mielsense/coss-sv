<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "drawer"],
    id: "p-drawer-1",
    interactive: true,
    responsive: true,
    title: "Basic drawer",
  });
</script>

<script lang="ts">
  import { buttonVariants, Drawer } from "@coss-sv/ui";
</script>

<Drawer.Root>
  <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
    Open drawer
  </Drawer.Trigger><Drawer.Popup showBar>
    <Drawer.Header class="text-center">
      <Drawer.Title>Notifications</Drawer.Title><Drawer.Description>
        This is the description of the drawer.
      </Drawer.Description>
    </Drawer.Header><Drawer.Footer class="justify-center sm:justify-center" variant="bare">
      <Drawer.Close class={buttonVariants({ variant: "outline" })}>Close</Drawer.Close>
    </Drawer.Footer>
  </Drawer.Popup>
</Drawer.Root>
