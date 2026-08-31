<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    id: "p-select-21",
    interactive: true,
    responsive: false,
    title: "Auto width select",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const items = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
    { label: "Astro", value: "astro" },
  ] as const;
</script>

<Select.Root aria-label="Select framework" value="next" {items}>
  <Select.Trigger class="w-fit"><Select.Value /></Select.Trigger><Select.Popup>
    {#each items as item (item.value)}<Select.Item value={item.value}>
        {item.label}
      </Select.Item>{/each}
  </Select.Popup>
</Select.Root>
