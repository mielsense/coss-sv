<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "group", "menu"],
    id: "p-group-3",
    interactive: true,
    responsive: false,
    title: "Small group",
  });
</script>

<script lang="ts">
  import { Button, buttonVariants, Group, HugeiconsIcon, Menu } from "@coss-sv/ui";
  import {
    Archive01Icon,
    Delete02Icon,
    Edit01Icon,
    Files01Icon,
    Film01Icon,
    MoreHorizontalIcon,
    Share01Icon,
  } from "@hugeicons/core-free-icons";
</script>

<Group.Root aria-label="File actions">
  <Button size="sm" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={Files01Icon} strokeWidth={2} />
    Files
  </Button>
  <Group.Separator />
  <Button size="sm" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={Film01Icon} strokeWidth={2} />
    Media
  </Button>
  <Group.Separator />
  <Menu.Root>
    <Menu.Trigger aria-label="Menu" class={buttonVariants({ size: "icon-sm", variant: "outline" })}>
      <HugeiconsIcon aria-hidden="true" class="size-4" icon={MoreHorizontalIcon} strokeWidth={2} />
    </Menu.Trigger>
    <Menu.Popup align="end">
      <Menu.Item
        ><HugeiconsIcon aria-hidden="true" icon={Edit01Icon} strokeWidth={2} />
        Edit</Menu.Item
      >
      <Menu.Item
        ><HugeiconsIcon aria-hidden="true" icon={Archive01Icon} strokeWidth={2} />
        Archive</Menu.Item
      >
      <Menu.Item
        ><HugeiconsIcon aria-hidden="true" icon={Share01Icon} strokeWidth={2} />
        Share</Menu.Item
      >
      <Menu.Item variant="destructive"
        ><HugeiconsIcon aria-hidden="true" icon={Delete02Icon} strokeWidth={2} />
        Delete</Menu.Item
      >
    </Menu.Popup>
  </Menu.Root>
</Group.Root>
