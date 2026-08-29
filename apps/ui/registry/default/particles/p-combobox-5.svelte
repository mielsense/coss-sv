<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["combobox", "label"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-combobox-5",
    interactive: true,
    responsive: false,
    title: "Combobox with label",
  });
</script>

<script lang="ts">
  import { Combobox, Label } from "@coss-sv/ui";

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
  const id = $props.id();
</script>

<Combobox.Root {items}>
  <div class="flex flex-col items-start gap-2">
    <Label for={id}>Fruits</Label>
    <Combobox.Input {id} aria-label="Select an item" placeholder="Select an item..."
    ></Combobox.Input>
  </div>
  <Combobox.Popup>
    <Combobox.Empty>No results found.</Combobox.Empty>
    <Combobox.List
      ><Combobox.Collection>
        {#snippet children(item: Item)}<Combobox.Item value={item}>{item.label}</Combobox.Item
          >{/snippet}
      </Combobox.Collection></Combobox.List
    >
  </Combobox.Popup>
</Combobox.Root>
