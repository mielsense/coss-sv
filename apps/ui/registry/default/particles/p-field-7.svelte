<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["autocomplete", "field"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-7",
    interactive: true,
    responsive: false,
    title: "Field with autocomplete",
  });
</script>

<script lang="ts">
  import { Autocomplete, Field } from "@coss-sv/ui";

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
  <Autocomplete.Root
    {items}
    itemToStringLabel={(item) => item.label}
    itemToStringValue={(item) => item.value}
  >
    <Autocomplete.Input aria-label="Search items" placeholder="Search items…" />
    <Autocomplete.Popup>
      <Autocomplete.Empty>No items found.</Autocomplete.Empty>
      <Autocomplete.List>
        <Autocomplete.Collection>
          {#snippet children(item: (typeof items)[number])}
            <Autocomplete.Item value={item}>{item.label}</Autocomplete.Item>
          {/snippet}
        </Autocomplete.Collection>
      </Autocomplete.List>
    </Autocomplete.Popup>
  </Autocomplete.Root>
  <Field.Description>Select a item.</Field.Description>
</Field.Root>
