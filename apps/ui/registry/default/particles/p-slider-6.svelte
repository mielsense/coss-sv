<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["slider"],
    id: "p-slider-6",
    interactive: true,
    responsive: true,
    title: "Intensity slider",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Slider } from "@coss-sv/ui";
</script>

<div>
  <div
    aria-hidden="true"
    class="mb-3 flex w-full items-center justify-between gap-2 font-medium text-muted-foreground text-xs"
  >
    <span>Low</span>
    <span>High</span>
  </div>
  <Slider.Root aria-label="Intensity level from low to high" defaultValue={50} step={10} />
</div>
