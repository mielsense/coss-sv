<script lang="ts">
  import * as Field from "../field/index.js";
  import * as OTPField from "./index.js";

  let value = $state("");
  let complete = $state("");
  let changes = $state(0);
  let invalidValue = $state("");
  let normalizedInvalidValue = $state("");
  let normalizedValue = $state("");
  let dynamicMiddle = $state(true);
  let resetValue = $state("12");
  let fieldInvalid = $state(false);
  let firstFieldSlotMounted = $state(true);
</script>

<form data-testid="otp-form" onsubmit={(event) => event.preventDefault()}>
  <OTPField.Root
    bind:value
    aria-label="Verification code"
    length={6}
    name="code"
    onComplete={(next) => (complete = next)}
    onValueChange={() => (changes += 1)}
    required
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

<OTPField.Root aria-label="Alpha code" length={2} validationType="alpha">
  <OTPField.Input data-testid="alpha-otp" />
  <OTPField.Input />
</OTPField.Root>

<OTPField.Root
  aria-label="Normalized alpha code"
  bind:value={normalizedValue}
  length={2}
  normalizeValue={(next) => next.toUpperCase()}
  onValueInvalid={(next) => (normalizedInvalidValue = next)}
  validationType="alpha"
>
  <OTPField.Input data-testid="normalized-otp" />
  <OTPField.Input />
</OTPField.Root>

<OTPField.Root aria-label="Dynamic code" length={3}>
  <OTPField.Input data-testid="dynamic-first" />
  {#if dynamicMiddle}
    <OTPField.Input data-testid="dynamic-middle" />
  {/if}
  <OTPField.Input data-testid="dynamic-last" />
</OTPField.Root>
<button data-testid="toggle-dynamic" type="button" onclick={() => (dynamicMiddle = !dynamicMiddle)}>
  Toggle dynamic slot
</button>

<form id="external-otp-form" data-testid="external-otp-form">
  <button type="reset">Reset external</button>
  <button type="submit">Submit external</button>
</form>
<OTPField.Root
  aria-label="External code"
  bind:value={resetValue}
  defaultValue="12"
  form="external-otp-form"
  length={2}
  name="external-code"
  required
>
  <OTPField.Input data-testid="external-first" />
  <OTPField.Input data-testid="external-second" />
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
  <Field.Label id={fieldInvalid ? "field-security-label-invalid" : "field-security-label-valid"}
    >Security code</Field.Label
  >
  <OTPField.Root length={2}>
    <OTPField.Input data-testid="field-otp-first" />
    <OTPField.Input aria-label="Security character 2" data-testid="field-otp-second" />
  </OTPField.Root>
  {#if fieldInvalid}
    <Field.Description id="field-security-error">Security code is invalid.</Field.Description>
  {:else}
    <Field.Description id="field-security-description"
      >Enter both security characters.</Field.Description
    >
  {/if}
</Field.Root>

<Field.Root>
  <Field.Label data-testid="dynamic-field-otp-label">Dynamic security code</Field.Label>
  <OTPField.Root length={2}>
    {#if firstFieldSlotMounted}
      <OTPField.Input data-testid="dynamic-field-otp-first" />
    {/if}
    <OTPField.Input
      aria-label="Dynamic security character 2"
      data-testid="dynamic-field-otp-second"
    />
  </OTPField.Root>
</Field.Root>
<button
  data-testid="toggle-first-field-slot"
  type="button"
  onclick={() => (firstFieldSlotMounted = !firstFieldSlotMounted)}
>
  Toggle first field slot
</button>
<button
  data-testid="toggle-field-error"
  type="button"
  onclick={() => (fieldInvalid = !fieldInvalid)}
>
  Toggle field error
</button>

<Field.Root>
  <Field.Label id="explicit-field-label">Explicit security code</Field.Label>
  <OTPField.Root length={2}>
    <OTPField.Input
      aria-describedby="explicit-slot-description"
      aria-label="Explicit character"
      data-testid="explicit-field-otp-first"
    />
    <OTPField.Input aria-label="Explicit character 2" />
  </OTPField.Root>
  <Field.Description id="explicit-field-description">Field description.</Field.Description>
  <p id="explicit-slot-description">Slot description.</p>
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
<output data-testid="normalized-state">{normalizedValue}:{normalizedInvalidValue}</output>
<output data-testid="reset-state">{resetValue}</output>
