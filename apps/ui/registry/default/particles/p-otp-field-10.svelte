<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["field", "otp-field"],
    id: "p-otp-field-10",
    interactive: true,
    responsive: false,
    title: "Masked OTP field",
  });
</script>

<script lang="ts">
  import { Field, OTPField } from "@coss-sv/ui";

  const length = 6;
</script>

<Field.Root class="items-center">
  <Field.Label>Access code</Field.Label>
  <OTPField.Root {length} mask>
    {#each Array(length) as _, index (index)}
      <OTPField.Input aria-label={`Character ${index + 1} of ${length}`} />
    {/each}
  </OTPField.Root>
  <Field.Description>
    Use <code class="font-mono text-foreground">mask</code>
    to obscure the code on shared screens.
  </Field.Description>
</Field.Root>
