<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["otp-field"],
    id: "p-otp-field-2",
    interactive: true,
    responsive: false,
    title: "Large OTP field",
  });
</script>

<script lang="ts">
  import { OTPField } from "@coss-sv/ui";

  const length = 4;
</script>

<OTPField.Root aria-label="One-time password" {length} size="lg">
  {#each Array(length) as _, index (index)}
    <OTPField.Input aria-label={index === 0 ? undefined : `Character ${index + 1} of ${length}`} />
  {/each}
</OTPField.Root>
