<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["context-menu"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-sm",
    id: "p-context-menu-6",
    interactive: true,
    responsive: true,
    title: "Context menu with icons",
  });
</script>

<script lang="ts">
  import { ContextMenu } from "@coss-sv/ui";
  import { Copy01Icon, Delete02Icon, PencilIcon, Share08Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<ContextMenu.Root
  ><ContextMenu.Trigger
    class="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm"
    >Right click here</ContextMenu.Trigger
  ><ContextMenu.Popup
    ><ContextMenu.Item
      ><HugeiconsIcon
        aria-hidden="true"
        icon={PencilIcon}
        strokeWidth={2}
      />Edit<ContextMenu.Shortcut>⌘E</ContextMenu.Shortcut></ContextMenu.Item
    ><ContextMenu.Item
      ><HugeiconsIcon
        aria-hidden="true"
        icon={Copy01Icon}
        strokeWidth={2}
      />Copy<ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut></ContextMenu.Item
    ><ContextMenu.Item
      ><HugeiconsIcon
        aria-hidden="true"
        icon={Share08Icon}
        strokeWidth={2}
      />Share</ContextMenu.Item
    ><ContextMenu.Separator /><ContextMenu.Item variant="destructive"
      ><HugeiconsIcon
        aria-hidden="true"
        icon={Delete02Icon}
        strokeWidth={2}
      />Delete<ContextMenu.Shortcut>⌘⌫</ContextMenu.Shortcut></ContextMenu.Item
    ></ContextMenu.Popup
  ></ContextMenu.Root
>
