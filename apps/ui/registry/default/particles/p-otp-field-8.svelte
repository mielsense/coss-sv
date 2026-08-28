<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["field", "otp-field"],
  id: "p-otp-field-8",
  interactive: true,
  responsive: false,
  title: "Alphanumeric OTP field",
});
</script>
<script lang="ts">
import { Field, OTPField } from "@coss-sv/ui";
const length = 6;
</script>
<Field.Root class="items-center">
  <Field.Label>Recovery code</Field.Label>
  <OTPField.Root {length} validationType="alphanumeric">
    {#each Array(length) as _, index (index)}
      <OTPField.Input aria-label={`Character ${index + 1} of ${length}`} />
    {/each}
  </OTPField.Root>
  <Field.Description
    >Accept letters and numbers for backup codes such as
    <code class="font-mono text-foreground">A7C9XZ</code>.</Field.Description
  >
</Field.Root>
