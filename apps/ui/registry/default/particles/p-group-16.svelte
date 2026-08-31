<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "group", "input"],
    id: "p-group-16",
    interactive: true,
    responsive: false,
    title: "Group with add button and input",
  });
</script>

<script lang="ts">
  import { Button, Group, HugeiconsIcon, Input } from "@coss-sv/ui";
  import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
</script>

<Group.Root aria-label="Add item">
  <Button aria-label="Add" size="icon" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={Add01Icon} strokeWidth={2} />
  </Button>
  <Group.Separator />
  <Input aria-label="Item name" placeholder="Enter item name" type="text" />
</Group.Root>
