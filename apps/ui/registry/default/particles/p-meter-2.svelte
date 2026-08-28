<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["meter"],
    id: "p-meter-2",
    interactive: false,
    responsive: false,
    title: "Meter without visible label",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Meter } from "@coss-sv/ui";
</script>

<Meter.Root value={50}><Meter.Track><Meter.Indicator /></Meter.Track></Meter.Root>
