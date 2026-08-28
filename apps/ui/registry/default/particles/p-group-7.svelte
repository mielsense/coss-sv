<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["group", "input", "label"],
  id: "p-group-7",
  interactive: true,
  responsive: false,
  title: "Group with start text",
});
</script>
<script lang="ts">
import { Group, Input } from "@coss-sv/ui";
</script>
<Group.Root aria-label="Domain input">
  <Group.Text as="label" aria-label="Domain" for="domain">https://</Group.Text>
  <Group.Separator />
  <Input aria-label="Domain" value="coss.com" id="domain" type="text" />
</Group.Root>
