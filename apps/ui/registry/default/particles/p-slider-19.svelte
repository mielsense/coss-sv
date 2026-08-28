<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["number-field", "slider"],
  id: "p-slider-19",
  interactive: true,
  responsive: true,
  title: "Vertical slider with input",
});
</script>

<script lang="ts">
import { NumberField, Slider } from "@coss-sv/ui";
const min = 0;
const max = 100;
let value = $state(25);
</script>

<div class="flex flex-col items-center justify-center gap-4">
  <Slider.Root
    aria-label="Vertical slider with input"
    {max}
    {min}
    orientation="vertical"
    bind:value
  />
  <NumberField.Root aria-label="Enter slider value" class="w-16" {max} {min} size="sm" bind:value
    ><NumberField.Group><NumberField.Input /></NumberField.Group></NumberField.Root
  >
</div>
