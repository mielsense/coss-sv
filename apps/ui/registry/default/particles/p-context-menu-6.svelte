<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  import { ContextMenu, HugeiconsIcon } from "@coss-sv/ui";
  import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
  import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";
  import PencilIcon from "@hugeicons/core-free-icons/PencilIcon";
  import Share08Icon from "@hugeicons/core-free-icons/Share08Icon";
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger
    class="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm"
  >
    Right click here
  </ContextMenu.Trigger><ContextMenu.Popup>
    <ContextMenu.Item>
      <HugeiconsIcon
        aria-hidden="true"
        icon={PencilIcon}
        strokeWidth={2}
      />Edit<ContextMenu.Shortcut>⌘E</ContextMenu.Shortcut>
    </ContextMenu.Item><ContextMenu.Item>
      <HugeiconsIcon
        aria-hidden="true"
        icon={Copy01Icon}
        strokeWidth={2}
      />Copy<ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut>
    </ContextMenu.Item><ContextMenu.Item>
      <HugeiconsIcon aria-hidden="true" icon={Share08Icon} strokeWidth={2} />Share
    </ContextMenu.Item><ContextMenu.Separator /><ContextMenu.Item variant="destructive">
      <HugeiconsIcon
        aria-hidden="true"
        icon={Delete02Icon}
        strokeWidth={2}
      />Delete<ContextMenu.Shortcut>⌘⌫</ContextMenu.Shortcut>
    </ContextMenu.Item>
  </ContextMenu.Popup>
</ContextMenu.Root>
