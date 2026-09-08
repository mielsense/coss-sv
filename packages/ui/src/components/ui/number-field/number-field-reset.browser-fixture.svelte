<script lang="ts">
  import * as NumberField from "./index.js";

  let value = $state<number | null>(2);
  let canceledValue = $state<number | null>(2);
  let externalValue = $state<number | null>(3);
  let cancelReset = $state(false);
  let commits = $state(0);
  let resetChanges = $state(0);
  let resetCommits = $state(0);
</script>

<form
  data-testid="reset-form"
  onreset={(event) => {
    if (cancelReset) event.preventDefault();
  }}
>
  <NumberField.Root
    bind:value
    defaultValue={2}
    name="quantity"
    locale="de-DE"
    format={{ minimumFractionDigits: 1 }}
    onValueChange={() => (resetChanges += 1)}
    onValueCommitted={() => (resetCommits += 1)}
  >
    <NumberField.Group><NumberField.Input data-testid="reset-input" /></NumberField.Group>
  </NumberField.Root>
  <button type="reset" data-testid="reset">Reset</button>
</form>
<button type="button" onclick={() => (cancelReset = !cancelReset)} data-testid="cancel-reset"
  >Cancel reset</button
>
<output data-testid="reset-value">{value}</output>
<output data-testid="reset-callbacks">{resetChanges}:{resetCommits}</output>

<form data-testid="controlled-form">
  <NumberField.Root bind:value={() => 7, () => {}} defaultValue={1} name="locked">
    <NumberField.Group><NumberField.Input data-testid="controlled-input" /></NumberField.Group>
  </NumberField.Root>
</form>

<form id="number-external-form" data-testid="external-form"></form>
<NumberField.Root
  bind:value={externalValue}
  defaultValue={3}
  name="external"
  form="number-external-form"
>
  <NumberField.Group><NumberField.Input data-testid="external-input" /></NumberField.Group>
</NumberField.Root>
<output data-testid="external-value">{externalValue}</output>

<form data-testid="canceled-form">
  <NumberField.Root
    bind:value={canceledValue}
    name="canceled"
    onValueChange={(_value, details) => details.cancel()}
    onValueCommitted={() => (commits += 1)}
  >
    <NumberField.Group><NumberField.Input data-testid="canceled-input" /></NumberField.Group>
  </NumberField.Root>
</form>
<output data-testid="canceled-value">{canceledValue}:{commits}</output>
