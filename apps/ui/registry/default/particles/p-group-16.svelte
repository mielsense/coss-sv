<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "group", "input"],
  id: "p-group-16",
  interactive: true,
  responsive: false,
  title: "Group with add button and input",
});
</script>
<script lang="ts">
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, Group, Input } from "@coss-sv/ui";
</script>
<Group.Root aria-label="Add item">
  <Button aria-label="Add" size="icon" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={Add01Icon} strokeWidth={2} />
  </Button>
  <Group.Separator />
  <Input aria-label="Item name" placeholder="Enter item name" type="text" />
</Group.Root>
