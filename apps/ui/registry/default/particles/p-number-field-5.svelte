<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["label", "number-field"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-number-field-5",
  interactive: true,
  responsive: false,
  title: "Number field with label",
});
</script>
<script lang="ts">
import { Label, NumberField } from "@coss-sv/ui";
const id = $props.id();
</script>
<div class="flex flex-col items-start gap-2">
  <Label for={id}>Quantity</Label
  ><NumberField.Root defaultValue={0} {id}
    ><NumberField.Group
      ><NumberField.Decrement /><NumberField.Input /><NumberField.Increment /></NumberField.Group
    ></NumberField.Root
  >
</div>
