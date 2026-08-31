<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-22",
    interactive: true,
    responsive: false,
    title: "Select with custom border and background",
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
  <Select.Trigger class="border-transparent bg-muted shadow-none before:hidden">
    <Select.Value />
  </Select.Trigger><Select.Popup>
    {#each items as item (item.value)}<Select.Item value={item.value}>
        {item.label}
      </Select.Item>{/each}
  </Select.Popup>
</Select.Root>
