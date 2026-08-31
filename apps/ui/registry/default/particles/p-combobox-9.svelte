<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["combobox"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-combobox-9",
    interactive: true,
    responsive: false,
    title: "Combobox with multiple selection",
  });
</script>

<script lang="ts">
  import { Combobox } from "@coss-sv/ui";

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
  let value = $state<Item[]>([items[0], items[4]]);
</script>

<Combobox.Root {items} multiple bind:value name="fruits">
  <Combobox.Chips>
    {#each value as item (item.value)}<Combobox.Chip aria-label={item.label}>
        {item.label}
      </Combobox.Chip>{/each}
    <Combobox.ChipsInput
      aria-label="Select a item"
      {...value.length ? {} : { placeholder: "Select a item..." }}
    />
  </Combobox.Chips>
  <Combobox.Popup>
    <Combobox.Empty>No items found.</Combobox.Empty><Combobox.List>
      <Combobox.Collection>
        {#snippet children(item: Item)}<Combobox.Item value={item}>
            {item.label}
          </Combobox.Item>{/snippet}
      </Combobox.Collection>
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
