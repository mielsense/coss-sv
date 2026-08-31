<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["slider"],
    id: "p-slider-20",
    interactive: true,
    responsive: true,
    title: "Equalizer",
  });
</script>

<script lang="ts">
  import { Slider } from "@coss-sv/ui";

  const bands = [
    { label: "60 Hz", value: 2 },
    { label: "250 Hz", value: 1 },
    { label: "1k", value: -1 },
    { label: "4k", value: -3 },
    { label: "16k", value: 2 },
  ];
</script>

<div class="flex h-48 justify-center gap-8">
  {#each bands as band (band.label)}
    <Slider.Root
      aria-label={band.label}
      defaultValue={band.value}
      max={5}
      min={-5}
      orientation="vertical"
    />
  {/each}
</div>
