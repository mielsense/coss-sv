<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["number-field", "slider"],
    id: "p-slider-12",
    interactive: true,
    responsive: true,
    title: "Slider with input",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { NumberField, Slider } from "@coss-sv/ui";

  const min = 0;
  const max = 150;
  let value = $state(25);
</script>

<div class="flex items-center gap-4">
  <Slider.Root aria-label="Slider with input" class="flex-1" {max} {min} bind:value />
  <NumberField.Root aria-label="Enter slider value" class="w-12" {max} {min} size="sm" bind:value>
    <NumberField.Group><NumberField.Input /></NumberField.Group>
  </NumberField.Root>
</div>
