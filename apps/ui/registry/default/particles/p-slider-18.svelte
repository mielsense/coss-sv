<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["slider"],
    id: "p-slider-18",
    interactive: true,
    responsive: false,
    title: "Vertical range slider",
  });
</script>

<script lang="ts">
  import { Slider } from "@coss-sv/ui";
</script>

<div class="flex h-40 items-center justify-center">
  <Slider.Root aria-label="Range" defaultValue={[25, 75]} orientation="vertical" />
</div>
