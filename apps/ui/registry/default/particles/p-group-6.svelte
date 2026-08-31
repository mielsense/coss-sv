<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "group", "menu"],
    id: "p-group-6",
    interactive: true,
    responsive: false,
    title: "Group with default button",
  });
</script>

<script lang="ts">
  import { Button, buttonVariants, Group, HugeiconsIcon, Menu } from "@coss-sv/ui";
  import Archive01Icon from "@hugeicons/core-free-icons/Archive01Icon";
  import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";
  import Edit01Icon from "@hugeicons/core-free-icons/Edit01Icon";
  import Files01Icon from "@hugeicons/core-free-icons/Files01Icon";
  import Film01Icon from "@hugeicons/core-free-icons/Film01Icon";
  import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";
  import Share01Icon from "@hugeicons/core-free-icons/Share01Icon";
</script>

<Group.Root aria-label="File actions">
  <Button><HugeiconsIcon aria-hidden="true" icon={Files01Icon} strokeWidth={2} /> Files</Button>
  <Group.Separator class="bg-primary/72" />
  <Button><HugeiconsIcon aria-hidden="true" icon={Film01Icon} strokeWidth={2} /> Media</Button>
  <Group.Separator class="bg-primary/72" />
  <Menu.Root>
    <Menu.Trigger aria-label="Menu" class={buttonVariants({ size: "icon", variant: "default" })}>
      <HugeiconsIcon aria-hidden="true" class="size-4" icon={MoreHorizontalIcon} strokeWidth={2} />
    </Menu.Trigger>
    <Menu.Popup align="end">
      <Menu.Item>
        <HugeiconsIcon aria-hidden="true" icon={Edit01Icon} strokeWidth={2} />
        Edit
      </Menu.Item>
      <Menu.Item>
        <HugeiconsIcon aria-hidden="true" icon={Archive01Icon} strokeWidth={2} />
        Archive
      </Menu.Item>
      <Menu.Item>
        <HugeiconsIcon aria-hidden="true" icon={Share01Icon} strokeWidth={2} />
        Share
      </Menu.Item>
      <Menu.Item variant="destructive">
        <HugeiconsIcon aria-hidden="true" icon={Delete02Icon} strokeWidth={2} />
        Delete
      </Menu.Item>
    </Menu.Popup>
  </Menu.Root>
</Group.Root>
