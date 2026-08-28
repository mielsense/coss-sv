<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["label", "radio-group"],
  id: "p-radio-group-2",
  interactive: true,
  responsive: false,
  title: "Disabled radio item",
});
</script>

<script lang="ts">
import { Label, RadioGroup } from "@coss-sv/ui";

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "vite", label: "Vite (disabled)" },
  { value: "astro", label: "Astro" },
];
</script>

<RadioGroup.Root defaultValue="next">
  {#each frameworks as framework (framework.value)}
    <Label
      ><RadioGroup.Item disabled={framework.value === "vite"} value={framework.value} />
      {framework.label}</Label
    >
  {/each}
</RadioGroup.Root>
