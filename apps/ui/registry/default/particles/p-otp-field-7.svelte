<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["field", "otp-field"],
    id: "p-otp-field-7",
    interactive: true,
    responsive: false,
    title: "OTP field with auto validation",
  });
</script>

<script lang="ts">
  import { Field, OTPField } from "@coss-sv/ui";

  const length = 6;
  let value = $state("");
  let invalid = $state(false);
  const valid = $derived(value.length === length && value === "123456");
  function changed(next: string) {
    value = next;
    invalid = next.length === length ? next !== "123456" : false;
  }
</script>

<Field.Root class="items-center">
  <Field.Label>Verification code</Field.Label>
  <OTPField.Root {length} {value} onValueChange={changed}>
    {#each Array(length) as _, index (index)}
      <OTPField.Input
        aria-invalid={invalid || undefined}
        aria-label={`Character ${index + 1} of ${length}`}
      />
    {/each}
  </OTPField.Root>
  {#if !valid && !invalid}
    <Field.Description>Enter `123456` to pass validation.</Field.Description>
  {/if}
  {#if invalid}
    <Field.Error match={true}>Code must be 123456.</Field.Error>
  {/if}
  {#if valid}
    <Field.Description>Code verified.</Field.Description>
  {/if}
</Field.Root>
