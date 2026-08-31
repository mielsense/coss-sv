<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["slider"],
    id: "p-slider-8",
    interactive: true,
    responsive: true,
    title: "Three-thumb slider",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Slider } from "@coss-sv/ui";
</script>

<Slider.Root aria-label="Three values" defaultValue={[20, 50, 80]} />
