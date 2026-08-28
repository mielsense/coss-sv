<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["field", "otp-field"],
  id: "p-otp-field-6",
  interactive: true,
  responsive: false,
  title: "OTP field with custom sanitization",
});
</script>
<script lang="ts">
import { Field, OTPField } from "@coss-sv/ui";
const length = 6;
let focusedIndex = $state(0);
let invalidPulse = $state(0);
let statusMessage = $state("");
let timer: ReturnType<typeof setTimeout> | undefined;
let skipClear = false;
const activeInvalidIndex = $derived(invalidPulse > 0 ? focusedIndex : -1);
function normalizeTierCode(value: string) {
  return value.replace(/[^0-3]/g, "");
}
function clearInvalid() {
  clearTimeout(timer);
  timer = undefined;
  invalidPulse = 0;
  statusMessage = "";
}
function changed() {
  if (skipClear) {
    skipClear = false;
    return;
  }
  clearInvalid();
}
function invalid(value: string) {
  skipClear = true;
  invalidPulse += 1;
  statusMessage = `Unsupported characters were ignored from ${value}.`;
  clearTimeout(timer);
  timer = setTimeout(() => {
    timer = undefined;
    invalidPulse = 0;
  }, 400);
}
</script>
<Field.Root class="items-center">
  <Field.Label>Tier code</Field.Label>
  <OTPField.Root
    inputmode="numeric"
    {length}
    normalizeValue={normalizeTierCode}
    validationType="none"
    onValueChange={changed}
    onValueInvalid={invalid}
  >
    {#each Array(length) as _, index (index)}
      <OTPField.Input
        aria-invalid={activeInvalidIndex === index && invalidPulse > 0 ? true : undefined}
        aria-label={`Character ${index + 1} of ${length}`}
        onfocus={() => (focusedIndex = index)}
      />
    {/each}
  </OTPField.Root>
  <Field.Description>Digits 0-3 only.</Field.Description>
  <span aria-live="polite" class="sr-only">{statusMessage}</span>
</Field.Root>
