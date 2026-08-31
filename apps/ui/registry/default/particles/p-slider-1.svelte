<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["slider"],
    id: "p-slider-1",
    interactive: true,
    responsive: true,
    title: "Basic slider",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Slider } from "@coss-sv/ui";
</script>

<Slider.Root aria-label="Value" defaultValue={50} />
