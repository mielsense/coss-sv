<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["checkbox", "field"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-field-12",
  interactive: true,
  responsive: false,
  title: "Field with checkbox",
});
</script>

<script lang="ts">
import { Checkbox, Field } from "@coss-sv/ui";
</script>

<Field.Root>
  <Field.Label><Checkbox />Accept terms and conditions</Field.Label>
</Field.Root>
