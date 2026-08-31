<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["combobox", "field"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-8",
    interactive: true,
    responsive: false,
    title: "Field with combobox",
  });
</script>

<script lang="ts">
  import { Combobox, Field } from "@coss-sv/ui";

  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
    { label: "Grape", value: "grape" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Mango", value: "mango" },
    { label: "Pineapple", value: "pineapple" },
    { label: "Kiwi", value: "kiwi" },
    { label: "Peach", value: "peach" },
    { label: "Pear", value: "pear" },
  ];
</script>

<Field.Root>
  <Field.Label>Fruits</Field.Label>
  <Combobox.Root
    {items}
    itemToStringLabel={(item) => item.label}
    itemToStringValue={(item) => item.value}
  >
    <Combobox.Input aria-label="Select an item" placeholder="Select an item..." />
    <Combobox.Popup>
      <Combobox.Empty>No results found.</Combobox.Empty>
      <Combobox.List>
        <Combobox.Collection>
          {#snippet children(item: (typeof items)[number])}
            <Combobox.Item value={item}>{item.label}</Combobox.Item>
          {/snippet}
        </Combobox.Collection>
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
  <Field.Description>Select a item.</Field.Description>
</Field.Root>
