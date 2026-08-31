<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["context-menu"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-sm",
    id: "p-context-menu-3",
    interactive: true,
    responsive: true,
    title: "Nested context menu",
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
    <ContextMenu.Item>Cut</ContextMenu.Item><ContextMenu.Item>
      Copy
    </ContextMenu.Item><ContextMenu.Item>Paste</ContextMenu.Item><ContextMenu.Sub>
      <ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger><ContextMenu.SubPopup>
        <ContextMenu.Item>Email link</ContextMenu.Item><ContextMenu.Item>
          Messages
        </ContextMenu.Item><ContextMenu.Item>Notes</ContextMenu.Item>
      </ContextMenu.SubPopup>
    </ContextMenu.Sub>
  </ContextMenu.Popup>
</ContextMenu.Root>
