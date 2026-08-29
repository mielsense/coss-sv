<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["slider"],
    id: "p-slider-17",
    interactive: true,
    responsive: false,
    title: "Vertical slider",
  });
</script>

<script lang="ts">
  import { Slider } from "@coss-sv/ui";
</script>

<Slider.Root aria-label="Value" defaultValue={50} orientation="vertical" />
