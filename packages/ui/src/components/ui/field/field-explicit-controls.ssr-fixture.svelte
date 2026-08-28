<script lang="ts">
  import Input from "../input/input.svelte";
  import * as NumberField from "../number-field/index.js";
  import * as Field from "./index.js";
</script>

<Field.Root controlId="explicit-input">
  <Field.Label data-testid="explicit-input-label">Explicit input</Field.Label>
  <Input data-testid="explicit-input" id="explicit-input" />
</Field.Root>

<Field.Root controlId="explicit-number">
  <Field.Label data-testid="explicit-number-label">Explicit number</Field.Label>
  <NumberField.Root defaultValue={2} id="explicit-number">
    <NumberField.Input data-testid="explicit-number" />
  </NumberField.Root>
</Field.Root>
