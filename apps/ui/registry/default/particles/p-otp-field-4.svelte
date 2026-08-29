<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["field", "otp-field"],
    id: "p-otp-field-4",
    interactive: true,
    responsive: false,
    title: "OTP field with label",
  });
</script>

<script lang="ts">
  import { Field, OTPField } from "@coss-sv/ui";

  const length = 4;
</script>

<Field.Root class="items-center">
  <Field.Label>Verification code</Field.Label>
  <OTPField.Root {length}>
    {#each Array(length) as _, index (index)}
      <OTPField.Input aria-label={`Character ${index + 1} of ${length}`} />
    {/each}
  </OTPField.Root>
  <Field.Description>Enter the {length}-digit code sent to your email.</Field.Description>
</Field.Root>
