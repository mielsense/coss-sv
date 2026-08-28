<script lang="ts">
import * as Field from "../field/index.js";
import * as NumberField from "./index.js";
</script>

<Field.Root invalid>
  <Field.Label id="ssr-field-number-label">SSR field quantity</Field.Label>
  <NumberField.Root defaultValue={3} max={10} min={1}>
    <NumberField.Group>
      <NumberField.Input data-testid="ssr-field-number-input" />
    </NumberField.Group>
  </NumberField.Root>
  <Field.Description id="ssr-field-number-description">
    SSR field quantity description
  </Field.Description>
  <Field.Error id="ssr-field-number-error" match>SSR field quantity error</Field.Error>
</Field.Root>

<Field.Root>
  <NumberField.Root defaultValue={2} max={100} min={1}>
    <NumberField.ScrubArea label="SSR scrub quantity" />
    <NumberField.Group>
      <NumberField.Input data-testid="ssr-field-scrub-number-input" />
    </NumberField.Group>
  </NumberField.Root>
  <Field.Description id="ssr-field-scrub-number-description">
    SSR scrub quantity description
  </Field.Description>
</Field.Root>

<Field.Root>
  <Field.Label id="ssr-removed-number-label">SSR removed quantity</Field.Label>
  <NumberField.Root
    aria-describedby="ssr-removed-number-description"
    aria-labelledby="ssr-removed-number-label"
    defaultValue={4}
    max={10}
    min={1}
  >
    <NumberField.Input
      aria-describedby={null}
      aria-labelledby={null}
      data-testid="ssr-null-field-number-input"
    />
  </NumberField.Root>
  <Field.Description id="ssr-removed-number-description">
    SSR removed quantity description
  </Field.Description>
</Field.Root>
