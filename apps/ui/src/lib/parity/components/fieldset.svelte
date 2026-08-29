<script lang="ts">
  import { Field, Fieldset, Input } from "@coss-sv/ui";
</script>

<div class="docs-preview-width" data-particle="p-fieldset-1" id="p-fieldset-1">
  <Fieldset.Root class="flex w-full flex-col gap-6">
    <Fieldset.Legend>Billing Details</Fieldset.Legend>
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
</div>

<style>
  .docs-preview-width {
    width: min(16rem, 100%);
  }
</style>
