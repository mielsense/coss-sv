<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["field", "input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-field-2",
    interactive: true,
    responsive: false,
    title: "Field with required indicator",
  });
</script>

<script lang="ts">
  import { Field, Input } from "@coss-sv/ui";
</script>

<Field.Root>
  <Field.Label>
    Password <span class="text-destructive-foreground">*</span>
  </Field.Label>
  <Input placeholder="Enter password" required type="password" />
  <Field.Error>Please fill out this field.</Field.Error>
</Field.Root>
