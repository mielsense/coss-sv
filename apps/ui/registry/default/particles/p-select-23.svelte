<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-23",
    interactive: true,
    responsive: false,
    title: "Select with label",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const items = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ];
</script>

<Select.Root aria-label="Select fruit" value={items[0]} {items}>
  <Select.Label>Fruits</Select.Label><Select.Trigger><Select.Value /></Select.Trigger><Select.Popup>
    {#each items as item (item.value)}<Select.Item value={item}>{item.label}</Select.Item>{/each}
  </Select.Popup>
</Select.Root>
