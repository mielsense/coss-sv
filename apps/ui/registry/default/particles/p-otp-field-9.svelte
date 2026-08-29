<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["field", "otp-field"],
    id: "p-otp-field-9",
    interactive: true,
    responsive: false,
    title: "OTP field with placeholder hints",
  });
</script>

<script lang="ts">
  import { Field, OTPField } from "@coss-sv/ui";

  const length = 6;
</script>

<Field.Root class="items-center">
  <Field.Label>Verification code</Field.Label>
  <OTPField.Root {length}>
    {#each Array(length) as _, index (index)}
      <OTPField.Input
        aria-label={`Character ${index + 1} of ${length}`}
        class="placeholder:text-muted-foreground focus-visible:placeholder:text-transparent"
        placeholder="•"
      />
    {/each}
  </OTPField.Root>
  <Field.Description
    >Placeholder hints stay visible until the focused slot is active.</Field.Description
  >
</Field.Root>
