<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["field", "fieldset", "input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-fieldset-1",
    interactive: true,
    responsive: false,
    title: "Fieldset with multiple fields",
  });
</script>

<script lang="ts">
  import { Field, Fieldset, Input } from "@coss-sv/ui";

  const uid = $props.id();
  const legendId = `${uid}-legend`;
</script>

<Fieldset.Root class="flex w-full flex-col gap-6" {legendId}>
  <Fieldset.Legend id={legendId}>Billing Details</Fieldset.Legend>
  <Field.Root>
    <Field.Label>Company</Field.Label>
    <Input placeholder="Enter company name" type="text" />
    <Field.Description>The name that will appear on invoices.</Field.Description>
  </Field.Root>
  <Field.Root>
    <Field.Label>Tax ID</Field.Label>
    <Input placeholder="Enter tax identification number" type="text" />
    <Field.Description>Your business tax identification number.</Field.Description>
  </Field.Root>
</Fieldset.Root>
