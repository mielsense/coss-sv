<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["field", "slider"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-field-16",
  interactive: true,
  responsive: false,
  title: "Field with slider",
});
</script>

<script lang="ts">
import { Field, Slider } from "@coss-sv/ui";
</script>

<Field.Root class="items-stretch gap-3">
  <Field.Label>Country</Field.Label>
  <Slider.Root aria-label="Country" defaultValue={50} />
  <Field.Description>This is an optional field</Field.Description>
</Field.Root>
