<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "group", "menu"],
  id: "p-group-13",
  interactive: true,
  responsive: false,
  title: "Group with menu",
});
</script>
<script lang="ts">
import {
  ArrowDown01Icon,
  Download01Icon,
  Edit01Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, buttonVariants, Group, Menu } from "@coss-sv/ui";
</script>
<Group.Root aria-label="Subscription actions">
  <Button>Subscribe</Button>
  <Group.Separator class="bg-primary/72" />
  <Menu.Root>
    <Menu.Trigger
      aria-label="Copy options"
      class={buttonVariants({ size: "icon", variant: "default" })}
    >
      <HugeiconsIcon aria-hidden="true" class="size-4" icon={ArrowDown01Icon} strokeWidth={2} />
    </Menu.Trigger>
    <Menu.Popup align="end">
      <Menu.Item
        ><HugeiconsIcon aria-hidden="true" icon={Share01Icon} strokeWidth={2} />
        Share link</Menu.Item
      >
      <Menu.Item
        ><HugeiconsIcon aria-hidden="true" icon={Download01Icon} strokeWidth={2} />
        Download</Menu.Item
      >
      <Menu.Item
        ><HugeiconsIcon aria-hidden="true" icon={Edit01Icon} strokeWidth={2} />
        Duplicate</Menu.Item
      >
    </Menu.Popup>
  </Menu.Root>
</Group.Root>
