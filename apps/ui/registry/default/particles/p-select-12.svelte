<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-12",
    interactive: true,
    responsive: false,
    title: "Select with disabled items",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const items = [
    { disabled: false, label: "Next.js", value: "next" },
    { disabled: false, label: "Vite", value: "vite" },
    { disabled: true, label: "Astro (coming soon)", value: "astro" },
    { disabled: true, label: "Remix (coming soon)", value: "remix" },
    { disabled: false, label: "Nuxt", value: "nuxt" },
  ];
</script>

<Select.Root aria-label="Select framework" value="next" {items}>
  <Select.Trigger><Select.Value /></Select.Trigger><Select.Popup>
    {#each items as item (item.value)}<Select.Item disabled={item.disabled} value={item.value}>
        {item.label}
      </Select.Item>{/each}
  </Select.Popup>
</Select.Root>
