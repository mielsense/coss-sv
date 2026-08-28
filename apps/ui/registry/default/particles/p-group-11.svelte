<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["badge", "button", "group", "popover"],
  id: "p-group-11",
  interactive: true,
  responsive: false,
  title: "Group with popup",
});
</script>
<script lang="ts">
import { ArrowDown01Icon, GitForkIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Badge, Button, buttonVariants, Group, Popover } from "@coss-sv/ui";
</script>
<Group.Root aria-label="Repository actions">
  <Button variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={GitForkIcon} strokeWidth={2} />
    Fork
    <Badge variant="secondary">48</Badge>
  </Button>
  <Group.Separator />
  <Popover.Root>
    <Popover.Trigger
      aria-label="Send options"
      class={buttonVariants({ size: "icon", variant: "outline" })}
    >
      <HugeiconsIcon aria-hidden="true" icon={ArrowDown01Icon} strokeWidth={2} />
    </Popover.Trigger>
    <Popover.Popup align="end" class="w-64">
      <Popover.Title class="text-base">Existing forks</Popover.Title>
      <Popover.Description>You don't have any forks of this repository.</Popover.Description>
    </Popover.Popup>
  </Popover.Root>
</Group.Root>
