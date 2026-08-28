<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["number-field"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-number-field-7",
  interactive: true,
  responsive: false,
  title: "Number field with range",
});
</script>
<script lang="ts">
import { NumberField } from "@coss-sv/ui";
</script>
<NumberField.Root defaultValue={5} max={10} min={0}
  ><NumberField.Group
    ><NumberField.Decrement /><NumberField.Input /><NumberField.Increment /></NumberField.Group
  ></NumberField.Root
>
