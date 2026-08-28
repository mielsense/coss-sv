<script lang="ts">
  import * as Field from "../field/index.js";
  import Input from "./input.svelte";
</script>

<Field.Root>
  <Field.Label>Hydrated name</Field.Label>
  <Input data-testid="hydrated-field-input" />
  <Field.Description id="hydrated-input-description">Hydrated description</Field.Description>
</Field.Root>

<Field.Root controlId="hydrated-null-input">
  <Field.Label id="removed-input-label">Removed name</Field.Label>
  <Input
    aria-describedby={null}
    aria-labelledby={null}
    data-testid="hydrated-null-input"
    id="hydrated-null-input"
  />
  <Field.Description id="removed-input-description">Removed description</Field.Description>
</Field.Root>
