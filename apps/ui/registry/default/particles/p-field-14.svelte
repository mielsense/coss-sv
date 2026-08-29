<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["field", "fieldset", "radio-group"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-14",
    interactive: true,
    responsive: false,
    title: "Field with radio group",
  });
</script>

<script lang="ts">
  import { Field, Fieldset, RadioGroup } from "@coss-sv/ui";
</script>

<Field.Root as="fieldset" class="gap-2" name="plan">
  <Fieldset.Legend class="font-medium text-sm">Choose Plan</Fieldset.Legend>
  <RadioGroup.Root defaultValue="free">
    <Field.Item><Field.Label><RadioGroup.Item value="free" /> Free</Field.Label></Field.Item>
    <Field.Item><Field.Label><RadioGroup.Item value="pro" /> Pro</Field.Label></Field.Item>
    <Field.Item>
      <Field.Label><RadioGroup.Item value="enterprise" /> Enterprise</Field.Label>
    </Field.Item>
  </RadioGroup.Root>
  <Field.Description>Select the plan that fits your needs.</Field.Description>
</Field.Root>
