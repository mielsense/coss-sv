<script lang="ts">
import * as Field from "../field/index.js";
import * as NumberField from "./index.js";
</script>

<Field.Root>
  <Field.Label id="hydrated-number-label">Hydrated quantity</Field.Label>
  <NumberField.Root defaultValue={3} id="hydrated-number" max={10} min={1}>
    <NumberField.Input data-testid="hydrated-field-number-input" />
  </NumberField.Root>
  <Field.Description id="hydrated-number-description">
    Hydrated quantity description
  </Field.Description>
</Field.Root>

<Field.Root>
  <Field.Label id="hydrated-removed-number-label">Hydrated removed quantity</Field.Label>
  <NumberField.Root defaultValue={4} id="hydrated-removed-number" max={10} min={1}>
    <NumberField.Input
      aria-describedby={null}
      aria-labelledby={null}
      data-testid="hydrated-null-field-number-input"
    />
  </NumberField.Root>
  <Field.Description id="hydrated-removed-number-description">
    Hydrated removed quantity description
  </Field.Description>
</Field.Root>
