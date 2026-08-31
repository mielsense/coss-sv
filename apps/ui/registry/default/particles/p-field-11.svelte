<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["field", "select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-11",
    interactive: true,
    responsive: false,
    title: "Field with select",
  });
</script>

<script lang="ts">
  import { Field, Select } from "@coss-sv/ui";

  const items = [
    { label: "Select a country", value: null },
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "ca" },
    { label: "Australia", value: "au" },
  ];
</script>

<Field.Root>
  <Field.Label>Country</Field.Label>
  <Select.Root {items}>
    <Select.Trigger><Select.Value /></Select.Trigger>
    <Select.Popup>
      {#each items as item (item.value)}
        <Select.Item value={item.value}>{item.label}</Select.Item>
      {/each}
    </Select.Popup>
  </Select.Root>
  <Field.Description>This is an optional field</Field.Description>
</Field.Root>
