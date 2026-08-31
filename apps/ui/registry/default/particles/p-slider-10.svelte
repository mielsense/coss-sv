<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["slider"],
    id: "p-slider-10",
    interactive: true,
    responsive: true,
    title: "Collision behavior swap",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Slider } from "@coss-sv/ui";
</script>

<Slider.Root
  aria-label="Dual thumb slider with collision behavior swap"
  defaultValue={[25, 75]}
  thumbCollisionBehavior="swap"
/>
