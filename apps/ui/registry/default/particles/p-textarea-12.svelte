<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["field", "textarea"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-textarea-12",
  interactive: true,
  responsive: false,
  title: "Textarea field with required indicator",
});
</script>

<script lang="ts">
import { Field, Textarea } from "@coss-sv/ui";
</script>

<Field.Root>
  <Field.Label>Message <span class="text-destructive-foreground">*</span></Field.Label>
  <Textarea placeholder="Type your message here" required />
  <Field.Error>Please fill out this field.</Field.Error>
</Field.Root>
