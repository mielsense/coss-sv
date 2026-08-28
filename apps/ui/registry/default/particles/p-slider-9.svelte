<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["slider"],
  id: "p-slider-9",
  interactive: true,
  responsive: true,
  title: "Collision behavior none",
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
});
</script>

<script lang="ts">
import { Slider } from "@coss-sv/ui";
</script>
<Slider.Root
  aria-label="Dual thumb slider with collision behavior none"
  defaultValue={[25, 75]}
  thumbCollisionBehavior="none"
/>
