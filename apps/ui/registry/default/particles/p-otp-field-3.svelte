<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["otp-field"],
    id: "p-otp-field-3",
    interactive: true,
    responsive: false,
    title: "OTP field with separator",
  });
</script>

<script lang="ts">
  import { OTPField } from "@coss-sv/ui";

  const length = 6;
</script>

<OTPField.Root aria-label="Verification code" {length}>
  {#each Array(3) as _, index (index)}
    <OTPField.Input aria-label={index === 0 ? undefined : `Character ${index + 1} of ${length}`} />
  {/each}
  <OTPField.Separator />
  {#each Array(3) as _, index (index)}
    <OTPField.Input aria-label={`Character ${index + 4} of ${length}`} />
  {/each}
</OTPField.Root>
