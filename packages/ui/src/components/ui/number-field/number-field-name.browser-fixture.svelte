<script lang="ts">
  import * as Field from "../field/index.js";
  import * as NumberField from "./index.js";
  let submissions = $state(0);
  let fieldName = $state("quantity");
  let usesExternalForm = $state(false);
</script>

<form
  data-testid="number-form"
  onsubmit={(event) => {
    event.preventDefault();
    submissions += 1;
  }}
>
  <Field.Root name={fieldName}>
    <Field.Label>Quantity</Field.Label>
    <NumberField.Root
      defaultValue={1234.5}
      locale="en-US"
      {...usesExternalForm ? { form: "external-number" } : {}}
      step={0.5}
      required
      min={1}
      max={2000}
    >
      <NumberField.Input />
    </NumberField.Root>
  </Field.Root>
  <button type="submit">Submit</button>
</form>

<output data-testid="submissions">{submissions}</output>

<button type="button" onclick={() => (fieldName = "renamed")}>Rename field</button>
<button type="button" onclick={() => (usesExternalForm = !usesExternalForm)}>Move form</button>
<form
  id="external-number"
  data-testid="external-number"
  onsubmit={(event) => {
    event.preventDefault();
    submissions += 1;
  }}
>
  <button type="submit">External submit</button>
</form>
