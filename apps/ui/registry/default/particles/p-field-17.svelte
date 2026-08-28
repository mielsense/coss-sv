<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["field", "number-field"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-field-17",
  interactive: true,
  responsive: false,
  title: "Field with number field",
});
</script>

<script lang="ts">
import { Field, NumberField } from "@coss-sv/ui";
</script>

<Field.Root>
  <NumberField.Root defaultValue={1} max={100} min={1}>
    <NumberField.ScrubArea label="Quantity" />
    <NumberField.Group>
      <NumberField.Decrement />
      <NumberField.Input />
      <NumberField.Increment />
    </NumberField.Group>
  </NumberField.Root>
  <Field.Description>Choose a value between 1 and 100.</Field.Description>
</Field.Root>
