<script lang="ts">
import { Field, OTPField } from "@coss-sv/ui";
import { onDestroy } from "svelte";

let controlled = $state("");
let completed = $state("");
let focusedIndex = $state(0);
let invalidPulse = $state(0);
let statusMessage = $state("");
let invalidTimeout: ReturnType<typeof setTimeout> | undefined;
let validatedValue = $state("");
let validationInvalid = $state(false);
const validationValid = $derived(validatedValue.length === 6 && validatedValue === "123456");

onDestroy(() => {
  if (invalidTimeout) clearTimeout(invalidTimeout);
});

function handleTierInvalid(value: string) {
  invalidPulse += 1;
  statusMessage = `Unsupported characters were ignored from ${value}.`;
  if (invalidTimeout) clearTimeout(invalidTimeout);
  invalidTimeout = setTimeout(() => {
    invalidTimeout = undefined;
    invalidPulse = 0;
  }, 400);
}
</script>

<div class="fixture">
  <section data-particle="p-otp-field-1">
    <OTPField.Root aria-label="One-time password" length={6}>
      {#each Array(6) as _, index (index)}
        <OTPField.Input aria-label={index === 0 ? undefined : `Character ${index + 1} of 6`} />
      {/each}
    </OTPField.Root>
  </section>

  <section data-particle="p-otp-field-2">
    <OTPField.Root aria-label="One-time password" length={4} size="lg">
      {#each Array(4) as _, index (index)}
        <OTPField.Input aria-label={index === 0 ? undefined : `Character ${index + 1} of 4`} />
      {/each}
    </OTPField.Root>
  </section>

  <section data-particle="p-otp-field-3">
    <OTPField.Root aria-label="Verification code" length={6}>
      {#each Array(3) as _, index (index)}
        <OTPField.Input aria-label={index === 0 ? undefined : `Character ${index + 1} of 6`} />
      {/each}
      <OTPField.Separator />
      {#each Array(3) as _, index (index)}
        <OTPField.Input aria-label={`Character ${index + 4} of 6`} />
      {/each}
    </OTPField.Root>
  </section>

  <section data-particle="p-otp-field-4">
    <Field.Root class="items-center">
      <Field.Label>Verification code</Field.Label>
      <OTPField.Root length={4}>
        {#each Array(4) as _, index (index)}
          <OTPField.Input aria-label={`Character ${index + 1} of 4`} />
        {/each}
      </OTPField.Root>
      <Field.Description>Enter the 4-digit code sent to your email.</Field.Description>
    </Field.Root>
  </section>

  <section data-particle="p-otp-field-6">
    <Field.Root class="items-center">
      <Field.Label>Tier code</Field.Label>
      <OTPField.Root
        inputmode="numeric"
        length={6}
        normalizeValue={(value: string) => value.replace(/[^0-3]/g, "")}
        onValueInvalid={handleTierInvalid}
        validationType="none"
      >
        {#each Array(6) as _, index (index)}
          <OTPField.Input
            aria-invalid={invalidPulse > 0 && focusedIndex === index ? true : undefined}
            aria-label={`Character ${index + 1} of 6`}
            onfocus={() => (focusedIndex = index)}
          />
        {/each}
      </OTPField.Root>
      <Field.Description>Digits 0-3 only.</Field.Description>
      <span aria-live="polite" class="sr-only">{statusMessage}</span>
    </Field.Root>
  </section>

  <section data-particle="p-otp-field-7">
    <Field.Root class="items-center">
      <Field.Label>Verification code</Field.Label>
      <OTPField.Root
        bind:value={validatedValue}
        length={6}
        onValueChange={(nextValue: string) =>
          (validationInvalid = nextValue.length === 6 ? nextValue !== "123456" : false)}
      >
        {#each Array(6) as _, index (index)}
          <OTPField.Input
            aria-invalid={validationInvalid ? true : undefined}
            aria-label={`Character ${index + 1} of 6`}
          />
        {/each}
      </OTPField.Root>
      {#if !validationValid && !validationInvalid}
        <Field.Description>Enter `123456` to pass validation.</Field.Description>
      {:else if validationInvalid}
        <Field.Error>Code must be 123456.</Field.Error>
      {:else}
        <Field.Description>Code verified.</Field.Description>
      {/if}
    </Field.Root>
  </section>

  <section data-particle="p-otp-field-8">
    <Field.Root class="items-center">
      <Field.Label>Recovery code</Field.Label>
      <OTPField.Root length={6} validationType="alphanumeric">
        {#each Array(6) as _, index (index)}
          <OTPField.Input aria-label={`Character ${index + 1} of 6`} />
        {/each}
      </OTPField.Root>
      <Field.Description>
        Accept letters and numbers for backup codes such as
        <code class="font-mono text-foreground">A7C9XZ</code>.
      </Field.Description>
    </Field.Root>
  </section>

  <section data-particle="p-otp-field-9">
    <Field.Root class="items-center">
      <Field.Label>Verification code</Field.Label>
      <OTPField.Root length={6}>
        {#each Array(6) as _, index (index)}
          <OTPField.Input
            aria-label={`Character ${index + 1} of 6`}
            class="placeholder:text-muted-foreground focus-visible:placeholder:text-transparent"
            placeholder="•"
          />
        {/each}
      </OTPField.Root>
      <Field.Description>
        Placeholder hints stay visible until the focused slot is active.
      </Field.Description>
    </Field.Root>
  </section>

  <section data-particle="p-otp-field-10">
    <Field.Root class="items-center">
      <Field.Label>Access code</Field.Label>
      <OTPField.Root length={6} mask>
        {#each Array(6) as _, index (index)}
          <OTPField.Input aria-label={`Character ${index + 1} of 6`} />
        {/each}
      </OTPField.Root>
      <Field.Description>
        Use <code class="font-mono text-foreground">mask</code> to obscure the code on shared
        screens.
      </Field.Description>
    </Field.Root>
  </section>

  <section data-review-probes="otp-field">
    <OTPField.Root
      bind:value={controlled}
      aria-label="Controlled verification code"
      length={6}
      onComplete={(value: string) => (completed = value)}
    >
      {#each Array(6) as _, index (index)}
        <OTPField.Input aria-label={`Character ${index + 1} of 6`} data-testid={`otp-${index}`} />
      {/each}
    </OTPField.Root>
    <output data-testid="otp-state">{controlled}:{completed}</output>
  </section>
</div>

<style>
.fixture {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: 3rem 2rem;
  padding: 2rem;
}
.fixture section {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
}
[data-review-probes="otp-field"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
output {
  color: var(--muted-foreground);
  font-size: 0.75rem;
}
@media (max-width: 639px) {
  .fixture {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    padding: 1.5rem;
  }
}
</style>
