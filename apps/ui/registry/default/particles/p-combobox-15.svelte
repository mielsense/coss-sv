<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["combobox"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-combobox-15",
    interactive: true,
    responsive: false,
    title: "Pill-shaped combobox",
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
</script>

<Combobox.Root {items}>
  <Combobox.Input
    aria-label="Select a item"
    placeholder="Select a item..."
    class="[--radius-lg:9999px] [--radius:9999px]"
  ></Combobox.Input>

  <Combobox.Popup>
    <Combobox.Empty>No items found.</Combobox.Empty>
    <Combobox.List>
      <Combobox.Collection>
        {#snippet children(item: Item)}<Combobox.Item value={item}>
            {item.label}
          </Combobox.Item>{/snippet}
      </Combobox.Collection>
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
