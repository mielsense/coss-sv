<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-5",
    interactive: true,
    responsive: false,
    title: "Select without item alignment",
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

<Select.Root aria-label="Select framework" {items}>
  <Select.Trigger><Select.Value placeholder="Select framework" /></Select.Trigger>
  <Select.Popup alignItemWithTrigger={false}>
    {#each items as item (item.value)}<Select.Item value={item.value}>
        {item.label}
      </Select.Item>{/each}
  </Select.Popup>
</Select.Root>
