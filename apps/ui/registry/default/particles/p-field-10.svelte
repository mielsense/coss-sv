<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["field", "textarea"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-10",
    interactive: true,
    responsive: false,
    title: "Field with textarea",
  });
</script>

<script lang="ts">
  import { Field, Textarea } from "@coss-sv/ui";
</script>

<Field.Root>
  <Field.Label>Bio</Field.Label>
  <Textarea placeholder="Tell us about yourself…" />
  <Field.Description>Write a short bio. Maximum 500 characters.</Field.Description>
</Field.Root>
