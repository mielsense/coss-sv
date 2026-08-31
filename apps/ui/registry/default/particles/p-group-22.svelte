<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
    <NumberField.Root aria-label="Min value" delegate={numberGroup}>
      <NumberField.Input class="text-left" placeholder="From" />
    </NumberField.Root>
    <Group.Separator />
    <NumberField.Root aria-label="Max value" delegate={numberGroup}>
      <NumberField.Input class="text-left" placeholder="To" />
    </NumberField.Root>
  </Group.Root>
</div>

{#snippet numberGroup(props: NumberField.NumberFieldGroupProps)}
  <NumberField.Group {...props} />
{/snippet}
