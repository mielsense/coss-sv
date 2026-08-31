<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["context-menu"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-sm",
    id: "p-context-menu-5",
    interactive: true,
    responsive: true,
    title: "Context menu with group labels",
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
    <ContextMenu.Group>
      <ContextMenu.GroupLabel>File</ContextMenu.GroupLabel><ContextMenu.Item>
        Rename
      </ContextMenu.Item><ContextMenu.Item>Duplicate</ContextMenu.Item>
    </ContextMenu.Group><ContextMenu.Separator /><ContextMenu.Group>
      <ContextMenu.GroupLabel>Share</ContextMenu.GroupLabel><ContextMenu.Item>
        Send copy
      </ContextMenu.Item><ContextMenu.Item>Export</ContextMenu.Item>
    </ContextMenu.Group>
  </ContextMenu.Popup>
</ContextMenu.Root>
