<script lang="ts">
  import * as Fieldset from "../fieldset/index.js";
  import Input from "../input/input.svelte";
  import * as Field from "./index.js";

  let composedDisabled = $state(true);
</script>

<Field.Root invalid name="generated">
  <Field.Label data-testid="generated-label">Generated field</Field.Label>
  <Input data-testid="generated-control" value="bad" />
  <Field.Description data-testid="generated-description">Helpful text.</Field.Description>
  <Field.Error data-testid="generated-error" match={true}>Invalid value.</Field.Error>
</Field.Root>

<button
  data-testid="toggle-composed-disabled"
  onclick={() => (composedDisabled = !composedDisabled)}
  type="button"
>
  Toggle choices
</button>

<Field.Root
  as="fieldset"
  data-testid="composed-fieldset"
  disabled={composedDisabled}
  name="choices"
>
  <Fieldset.Legend data-testid="composed-legend">Choices</Fieldset.Legend>
  <Field.Item>
    <Field.Label>Choice <Input data-testid="composed-control" /></Field.Label>
  </Field.Item>
</Field.Root>

<Field.Root name="nested">
  <Field.Item>
    <Field.Label data-testid="nested-label">Nested field</Field.Label>
    <Input data-testid="nested-control" />
  </Field.Item>
</Field.Root>

<Field.Root name="native">
  <Field.Label data-testid="native-label">Native field</Field.Label>
  <Input data-testid="native-control" nativeInput />
  <Field.Description data-testid="native-description">Native helpful text.</Field.Description>
</Field.Root>

<span id="consumer-label">Consumer label</span>
<span id="consumer-description">Consumer description.</span>
<Field.Root name="overridden">
  <Field.Label data-testid="overridden-label">Generated label</Field.Label>
  <Input
    aria-describedby="consumer-description"
    aria-labelledby="consumer-label"
    data-testid="overridden-control"
    nativeInput
  />
  <Field.Description data-testid="overridden-description">Context description.</Field.Description>
</Field.Root>

<Field.Root name="aria-label">
  <Field.Label>Generated aria label</Field.Label>
  <Input aria-label="Consumer aria label" data-testid="aria-label-control" nativeInput />
</Field.Root>
