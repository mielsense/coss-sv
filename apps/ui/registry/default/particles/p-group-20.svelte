<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "group", "input"],
  id: "p-group-20",
  interactive: true,
  responsive: false,
  title: "Group with input and text button",
});
</script>
<script lang="ts">
import { Button, Group, Input } from "@coss-sv/ui";
</script>
<Group.Root aria-label="Email subscription">
  <Input aria-label="Email" placeholder="Email" type="email" />
  <Group.Separator />
  <Button variant="outline">Subscribe</Button>
</Group.Root>
