<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["context-menu"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-sm",
    id: "p-context-menu-7",
    interactive: true,
    responsive: true,
    title: "Context menu with radio group",
  });
</script>

<script lang="ts">
  import { ContextMenu } from "@coss-sv/ui";
</script>

<ContextMenu.Root
  ><ContextMenu.Trigger
    class="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm"
    >Right click here</ContextMenu.Trigger
  ><ContextMenu.Popup
    ><ContextMenu.RadioGroup value="system"
      ><ContextMenu.RadioItem value="light">Light</ContextMenu.RadioItem><ContextMenu.RadioItem
        value="dark">Dark</ContextMenu.RadioItem
      ><ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem></ContextMenu.RadioGroup
    ></ContextMenu.Popup
  ></ContextMenu.Root
>
