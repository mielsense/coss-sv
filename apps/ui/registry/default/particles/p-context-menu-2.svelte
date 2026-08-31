<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["context-menu"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-sm",
    id: "p-context-menu-2",
    interactive: true,
    responsive: true,
    title: "Context menu with link items",
  });
</script>

<script lang="ts">
  import { ContextMenu } from "@coss-sv/ui";
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger
    class="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm"
  >
    Right click here
  </ContextMenu.Trigger><ContextMenu.Popup>
    <ContextMenu.LinkItem href="/docs">Docs</ContextMenu.LinkItem><ContextMenu.LinkItem
      href="/particles"
    >
      Particles
    </ContextMenu.LinkItem>
  </ContextMenu.Popup>
</ContextMenu.Root>
