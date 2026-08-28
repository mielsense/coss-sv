<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "field", "slider"],
  id: "p-slider-14",
  interactive: true,
  responsive: true,
  title: "Slider with step buttons",
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-80",
});
</script>

<script lang="ts">
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, Field, Slider } from "@coss-sv/ui";
const min = 0;
const max = 200;
const step = 5;
let value = $state(100);
</script>

<Field.Root name="credits">
  <Field.Label class="tabular-nums">{value} credits/mo</Field.Label>
  <div class="flex items-center gap-2">
    <Button
      aria-label="Decrease value"
      disabled={value === min}
      onclick={() => value = Math.max(min, value - step)}
      size="icon"
      variant="outline"
      ><HugeiconsIcon aria-hidden="true" icon={MinusSignIcon} strokeWidth={2} /></Button
    >
    <Slider.Root aria-label="Credits slider" class="flex-1" {max} {min} {step} bind:value />
    <Button
      aria-label="Increase value"
      disabled={value === max}
      onclick={() => value = Math.min(max, value + step)}
      size="icon"
      variant="outline"
      ><HugeiconsIcon aria-hidden="true" icon={PlusSignIcon} strokeWidth={2} /></Button
    >
  </div>
</Field.Root>
