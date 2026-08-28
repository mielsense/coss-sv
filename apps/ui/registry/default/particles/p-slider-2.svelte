<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["field", "slider"],
  id: "p-slider-2",
  interactive: true,
  responsive: true,
  title: "Slider with label and value",
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
});
</script>

<script lang="ts">
import { Slider } from "@coss-sv/ui";
</script>
<div class="w-full">
  <Slider.Root defaultValue={50}>
    <div class="mb-2 flex items-center justify-between gap-1">
      <Slider.Label class="font-medium text-sm">Opacity</Slider.Label>
      <Slider.Value />
    </div>
  </Slider.Root>
</div>
