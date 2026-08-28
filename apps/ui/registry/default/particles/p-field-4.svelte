<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["field", "input"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-field-4",
  interactive: true,
  responsive: false,
  title: "Field showing validation error",
});
</script>

<script lang="ts">
import { Field, Input } from "@coss-sv/ui";
</script>

<Field.Root>
  <Field.Label>Email</Field.Label>
  <Input placeholder="Enter your email" type="email" />
  <Field.Error>Please enter a valid email address.</Field.Error>
</Field.Root>
