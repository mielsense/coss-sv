<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["context-menu"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-sm",
    id: "p-context-menu-1",
    interactive: true,
    responsive: true,
    title: "Basic context menu",
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
    <ContextMenu.Item>Back</ContextMenu.Item><ContextMenu.Item>
      Forward
    </ContextMenu.Item><ContextMenu.Separator /><ContextMenu.Item>Reload</ContextMenu.Item>
  </ContextMenu.Popup>
</ContextMenu.Root>
