<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["input-group", "number-field"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-group-6",
  interactive: true,
  responsive: false,
  title: "Input group with number field",
});
</script>
<script lang="ts">
import { InputGroup, NumberField } from "@coss-sv/ui";
</script>
<InputGroup.Root
  ><NumberField.Root aria-label="Enter the amount" defaultValue={10}
    ><NumberField.Input class="text-left" /></NumberField.Root
  ><InputGroup.Addon><InputGroup.Text>€</InputGroup.Text></InputGroup.Addon
  ><InputGroup.Addon align="inline-end"
    ><InputGroup.Text>EUR</InputGroup.Text></InputGroup.Addon
  ></InputGroup.Root
>
