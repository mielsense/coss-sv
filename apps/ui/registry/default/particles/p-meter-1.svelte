<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["meter"],
    id: "p-meter-1",
    interactive: false,
    responsive: false,
    title: "Storage usage meter",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Meter } from "@coss-sv/ui";
</script>

<Meter.Root value={75}
  ><div class="flex items-center justify-between gap-2">
    <Meter.Label>Storage usage</Meter.Label><Meter.Value />
  </div>
  <Meter.Track><Meter.Indicator /></Meter.Track></Meter.Root
>
