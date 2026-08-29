<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["checkbox", "checkbox-group", "field", "fieldset"],
    id: "p-field-13",
    interactive: true,
    responsive: false,
    title: "Field with checkbox group",
  });
</script>

<script lang="ts">
  import { CheckboxGroup, Field, Fieldset } from "@coss-sv/ui";
</script>

<Field.Root as="fieldset" class="gap-2" name="frameworks">
  <Fieldset.Legend class="font-medium text-sm">Frameworks</Fieldset.Legend>
  <CheckboxGroup.Root defaultValue={["react"]}>
    <Field.Item><Field.Label><CheckboxGroup.Item value="react" /> React</Field.Label></Field.Item>
    <Field.Item><Field.Label><CheckboxGroup.Item value="vue" /> Vue</Field.Label></Field.Item>
    <Field.Item><Field.Label><CheckboxGroup.Item value="svelte" /> Svelte</Field.Label></Field.Item>
  </CheckboxGroup.Root>
</Field.Root>
