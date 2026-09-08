<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["combobox", "field"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-9",
    interactive: true,
    responsive: false,
    title: "Field with multiple selection combobox",
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
  ] as const;
  type Item = (typeof items)[number];
  const MultipleValue = Combobox.Value<Item, true>;
</script>

<Field.Root>
  <Field.Label>Fruits</Field.Label>
  <Combobox.Root defaultValue={[items[0], items[4]]} {items} multiple>
    <Combobox.Chips>
      <MultipleValue>
        {#snippet children(selected: Item[])}
          {#each selected as item (item.value)}
            <Combobox.Chip aria-label={item.label}>{item.label}</Combobox.Chip>
          {/each}
          <Combobox.ChipsInput
            aria-label="Select items"
            {...selected.length > 0 ? {} : { placeholder: "Select items…" }}
          />
        {/snippet}
      </MultipleValue>
    </Combobox.Chips>
    <Combobox.Popup>
      <Combobox.Empty>No items found.</Combobox.Empty>
      <Combobox.List>
        {#snippet item(item: Item)}
          <Combobox.Item value={item}>{item.label}</Combobox.Item>
        {/snippet}
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
  <Field.Description>Select multiple items.</Field.Description>
</Field.Root>
