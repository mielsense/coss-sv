<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["field", "input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-3",
    interactive: true,
    responsive: false,
    title: "Field in disabled state",
  });
</script>

<script lang="ts">
  import { Field, Input } from "@coss-sv/ui";
</script>

<Field.Root disabled>
  <Field.Label>Email</Field.Label>
  <Input disabled placeholder="Enter your email" type="email" />
  <Field.Description>This field is currently disabled.</Field.Description>
</Field.Root>
