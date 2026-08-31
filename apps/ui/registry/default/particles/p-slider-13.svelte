<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["number-field", "slider"],
    id: "p-slider-13",
    interactive: true,
    responsive: true,
    title: "Range slider with inputs",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { NumberField, Slider } from "@coss-sv/ui";

  const min = 0;
  const max = 50;
  let values = $state<number[]>([0, 20]);
  function updateValue(index: number, next: number | null) {
    const value = next ?? min;
    values =
      index === 0
        ? [Math.min(value, values[1] ?? max), values[1] ?? max]
        : [values[0] ?? min, Math.max(value, values[0] ?? min)];
  }
</script>

<div class="flex items-center gap-2">
  <NumberField.Root
    aria-label="Minimum value"
    class="w-10"
    max={values[1]}
    {min}
    onValueChange={(next) => updateValue(0, next)}
    size="sm"
    value={values[0]}
  >
    <NumberField.Group><NumberField.Input /></NumberField.Group>
  </NumberField.Root>
  <Slider.Root
    aria-label="Dual range slider"
    class="flex-1 *:min-w-0!"
    {max}
    {min}
    bind:value={values}
  />
  <NumberField.Root
    aria-label="Maximum value"
    class="w-10"
    {max}
    min={values[0]}
    onValueChange={(next) => updateValue(1, next)}
    size="sm"
    value={values[1]}
  >
    <NumberField.Group><NumberField.Input /></NumberField.Group>
  </NumberField.Root>
</div>
