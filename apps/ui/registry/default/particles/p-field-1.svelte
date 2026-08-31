<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["field", "input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-1",
    interactive: true,
    responsive: false,
    title: "Field with description",
  });
</script>

<script lang="ts">
  import { Field, Input } from "@coss-sv/ui";
</script>

<Field.Root>
  <Field.Label>Name</Field.Label>
  <Input placeholder="Enter your name" type="text" />
  <Field.Description>Visible on your profile</Field.Description>
</Field.Root>
