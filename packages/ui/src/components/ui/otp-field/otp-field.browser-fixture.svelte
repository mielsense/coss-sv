<script lang="ts">
import * as Field from "../field/index.js";
import * as OTPField from "./index.js";

let value = $state("");
let complete = $state("");
let changes = $state(0);
let invalidValue = $state("");
</script>

<form data-testid="otp-form" onsubmit={(event) => event.preventDefault()}>
  <OTPField.Root
    bind:value
    aria-label="Verification code"
    length={6}
    name="code"
    onComplete={(next) => (complete = next)}
    onValueChange={() => (changes += 1)}
  >
    {#each Array(3) as _, index (index)}
      <OTPField.Input aria-label={index === 0 ? undefined : `Character ${index + 1} of 6`} />
    {/each}
    <OTPField.Separator />
    {#each Array(3) as _, index (index)}
      <OTPField.Input aria-label={`Character ${index + 4} of 6`} />
    {/each}
  </OTPField.Root>
  <button type="submit">Submit</button>
</form>

<OTPField.Root aria-label="Recovery code" length={4} validationType="alphanumeric">
  {#each Array(4) as _, index (index)}
    <OTPField.Input aria-label={`Recovery character ${index + 1}`} />
  {/each}
</OTPField.Root>

<OTPField.Root aria-label="Disabled code" disabled length={2}>
  <OTPField.Input />
  <OTPField.Input />
</OTPField.Root>

<OTPField.Root aria-label="Read only code" length={2} readonly value="12">
  <OTPField.Input />
  <OTPField.Input />
</OTPField.Root>

<Field.Root>
  <Field.Label>Security code</Field.Label>
  <OTPField.Root length={2}>
    <OTPField.Input data-testid="field-otp-first" />
    <OTPField.Input aria-label="Security character 2" data-testid="field-otp-second" />
  </OTPField.Root>
</Field.Root>

<OTPField.Root
  aria-label="Tier code"
  length={2}
  normalizeValue={(next) => next.replace(/[^0-3]/g, "")}
  onValueInvalid={(next) => (invalidValue = next)}
  validationType="none"
>
  <OTPField.Input data-testid="custom-otp" />
  <OTPField.Input />
</OTPField.Root>

<output data-testid="otp-state">{value}:{complete}:{changes}</output>
<output data-testid="otp-invalid-state">{invalidValue}</output>
