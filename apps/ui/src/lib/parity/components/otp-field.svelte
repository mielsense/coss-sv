<script lang="ts">
import { OTPField } from "@coss-sv/ui";

let controlled = $state("");
let completed = $state("");
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

  <section data-particle="p-otp-field-8">
    <div class="field-copy">
      <label for="recovery-code-0">Recovery code</label>
      <OTPField.Root length={6} validationType="alphanumeric">
        {#each Array(6) as _, index (index)}
          <OTPField.Input
            aria-label={`Character ${index + 1} of 6`}
            id={index === 0 ? "recovery-code-0" : undefined}
          />
        {/each}
      </OTPField.Root>
      <p>Accept letters and numbers for backup codes such as <code>A7C9XZ</code>.</p>
    </div>
  </section>

  <section data-particle="p-otp-field-9">
    <OTPField.Root aria-label="Placeholder code" length={6}>
      {#each Array(6) as _, index (index)}
        <OTPField.Input
          aria-label={`Character ${index + 1} of 6`}
          class="placeholder:text-muted-foreground focus-visible:placeholder:text-transparent"
          placeholder="•"
        />
      {/each}
    </OTPField.Root>
  </section>

  <section data-particle="p-otp-field-10">
    <OTPField.Root aria-label="Masked access code" length={6} mask>
      {#each Array(6) as _, index (index)}
        <OTPField.Input aria-label={`Character ${index + 1} of 6`} />
      {/each}
    </OTPField.Root>
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
.field-copy,
[data-review-probes="otp-field"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.field-copy label {
  font-weight: 500;
}
.field-copy p,
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
