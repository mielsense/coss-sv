<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-6",
    interactive: true,
    responsive: false,
    title: "Select with groups",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const frontend = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
    { label: "Astro", value: "astro" },
  ];
  const backend = [
    { label: "Express", value: "express" },
    { label: "NestJS", value: "nestjs" },
    { label: "Fastify", value: "fastify" },
    { label: "Django", value: "django" },
    { label: "Flask", value: "flask" },
    { label: "Rails", value: "rails" },
  ];
</script>

<Select.Root aria-label="Select framework" items={[...frontend, ...backend]}>
  <Select.Trigger><Select.Value placeholder="Select framework" /></Select.Trigger><Select.Popup>
    <Select.Group
      ><Select.GroupLabel>Frontend</Select.GroupLabel
      >{#each frontend as item (item.value)}<Select.Item value={item.value}
          >{item.label}</Select.Item
        >{/each}</Select.Group
    >
    <Select.Separator />
    <Select.Group
      ><Select.GroupLabel>Backend</Select.GroupLabel
      >{#each backend as item (item.value)}<Select.Item value={item.value}>{item.label}</Select.Item
        >{/each}</Select.Group
    >
  </Select.Popup></Select.Root
>
