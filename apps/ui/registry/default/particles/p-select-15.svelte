<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-15",
    interactive: true,
    responsive: false,
    title: "Pill-shaped select trigger",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const items = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Archived", value: "archived" },
  ];
</script>

<Select.Root aria-label="Select filter" value="active" {items}>
  <Select.Trigger class="[--radius-lg:9999px] [--radius:9999px]">
    <Select.Value />
  </Select.Trigger><Select.Popup>
    {#each items as item (item.value)}<Select.Item value={item.value}>
        {item.label}
      </Select.Item>{/each}
  </Select.Popup>
</Select.Root>
