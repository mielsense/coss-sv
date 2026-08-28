<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["field", "switch"],
  id: "p-field-15",
  interactive: true,
  responsive: false,
  title: "Field with toggle switch",
});
</script>

<script lang="ts">
import { Field, Switch } from "@coss-sv/ui";
</script>

<Field.Root>
  <Field.Label
    ><Switch />
    Email notifications</Field.Label
  >
</Field.Root>
