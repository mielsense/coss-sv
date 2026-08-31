<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["number-field"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-number-field-6",
    interactive: true,
    responsive: false,
    title: "Number field with scrub",
  });
</script>

<script lang="ts">
  import { NumberField } from "@coss-sv/ui";
</script>

<NumberField.Root defaultValue={0}>
  <NumberField.ScrubArea label="Quantity" />
  <NumberField.Group>
    <NumberField.Decrement /><NumberField.Input /><NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
