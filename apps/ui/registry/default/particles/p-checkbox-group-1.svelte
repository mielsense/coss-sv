<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["checkbox", "checkbox-group", "label"],
    id: "p-checkbox-group-1",
    interactive: true,
    responsive: false,
    title: "Basic checkbox group",
  });
</script>

<script lang="ts">
  import { CheckboxGroup, Label } from "@coss-sv/ui";

  const frameworks = [
    { value: "next", label: "Next.js" },
    { value: "vite", label: "Vite" },
    { value: "astro", label: "Astro" },
  ];
</script>

<CheckboxGroup.Root aria-label="Select frameworks" defaultValue={["next"]}>
  {#each frameworks as framework (framework.value)}
    <Label><CheckboxGroup.Item value={framework.value} />{framework.label}</Label>
  {/each}
</CheckboxGroup.Root>
