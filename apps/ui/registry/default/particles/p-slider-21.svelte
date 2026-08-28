<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "fieldset", "label", "number-field", "slider"],
  id: "p-slider-21",
  interactive: true,
  responsive: true,
  title: "Object position",
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-96",
});
</script>

<script lang="ts">
import { RotateLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, Fieldset, Label, NumberField, Slider } from "@coss-sv/ui";
const min = -10;
const max = 10;
type Axis = "x" | "y" | "z";
let values = $state<Record<Axis, number>>({ x: -2, y: 4, z: 2 });
function updateValue(axis: Axis, next: number | null) {
  values = { ...values, [axis]: next ?? 0 };
}
</script>

<Fieldset.Root class="flex w-full flex-col gap-4">
  <Fieldset.Legend>Object position</Fieldset.Legend>
  <div class="flex flex-col gap-2">
    {#each ["x", "y", "z"] as axis (axis)}
      <div class="flex items-center gap-2">
        <Label class="w-3 text-muted-foreground text-xs">{axis.toUpperCase()}</Label>
        <Slider.Root
          aria-label={`${axis.toUpperCase()} position`}
          class="flex-1"
          {max}
          {min}
          onValueChange={(next) => updateValue(axis as Axis, Array.isArray(next) ? (next[0] ?? 0) : next)}
          value={values[axis as Axis]}
        />
        <NumberField.Root
          aria-label={`Enter ${axis.toUpperCase()} value`}
          class="w-16"
          {max}
          {min}
          onValueChange={(next) => updateValue(axis as Axis, next)}
          size="sm"
          value={values[axis as Axis]}
          ><NumberField.Group><NumberField.Input /></NumberField.Group></NumberField.Root
        >
      </div>
    {/each}
  </div>
  <Button class="w-full" onclick={() => values = { x: 0, y: 0, z: 0 }} variant="outline"
    ><HugeiconsIcon
      aria-hidden="true"
      class="-ms-1 opacity-60"
      icon={RotateLeft01Icon}
      strokeWidth={2}
    />Reset</Button
  >
</Fieldset.Root>
