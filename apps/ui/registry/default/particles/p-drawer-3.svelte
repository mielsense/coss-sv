<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "drawer"],
    id: "p-drawer-3",
    interactive: true,
    responsive: true,
    title: "Straight side drawer",
  });
</script>

<script lang="ts">
  import { buttonVariants, Drawer } from "@coss-sv/ui";
</script>

<Drawer.Root position="right">
  <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
    Open drawer
  </Drawer.Trigger><Drawer.Popup showCloseButton variant="straight">
    <Drawer.Header>
      <Drawer.Title>Notifications</Drawer.Title><Drawer.Description>
        This is the description of the drawer.
      </Drawer.Description>
    </Drawer.Header><Drawer.Panel>
      <p class="text-muted-foreground text-sm">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris.
      </p>
    </Drawer.Panel>
  </Drawer.Popup>
</Drawer.Root>
