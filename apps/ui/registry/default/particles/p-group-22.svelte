<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["group", "label", "number-field"],
  id: "p-group-22",
  interactive: true,
  responsive: false,
  title: "Group with two number inputs for range",
});
</script>
<script lang="ts">
import { Group, Label, NumberField } from "@coss-sv/ui";
</script>
<div class="flex flex-col gap-2">
  <Label>Range</Label>
  <Group.Root aria-label="Range input">
    <NumberField.Root aria-label="Min value">
      <NumberField.Group
        ><NumberField.Input class="text-left" placeholder="From" /></NumberField.Group
      >
    </NumberField.Root>
    <Group.Separator />
    <NumberField.Root aria-label="Max value">
      <NumberField.Group
        ><NumberField.Input class="text-left" placeholder="To" /></NumberField.Group
      >
    </NumberField.Root>
  </Group.Root>
</div>
