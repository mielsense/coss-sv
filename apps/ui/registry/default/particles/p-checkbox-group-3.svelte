<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["checkbox", "checkbox-group", "label"],
    id: "p-checkbox-group-3",
    interactive: true,
    responsive: false,
    title: "Checkbox group with parent",
  });
</script>

<script lang="ts">
  import { CheckboxGroup, Label } from "@coss-sv/ui";

  const frameworks = [
    { value: "next", label: "Next.js" },
    { value: "vite", label: "Vite" },
    { value: "astro", label: "Astro" },
  ];
  let value = $state<string[]>([]);
</script>

<CheckboxGroup.Root
  allValues={frameworks.map(({ value }) => value)}
  aria-labelledby="frameworks-caption"
  bind:value
>
  <Label id="frameworks-caption"><CheckboxGroup.Item name="frameworks" parent />Frameworks</Label>
  {#each frameworks as framework (framework.value)}
    <Label class="ms-4"><CheckboxGroup.Item value={framework.value} />{framework.label}</Label>
  {/each}
</CheckboxGroup.Root>
