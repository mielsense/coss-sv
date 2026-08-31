<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["meter"],
    id: "p-meter-4",
    interactive: false,
    responsive: false,
    title: "Range meter",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Meter } from "@coss-sv/ui";
</script>

<Meter.Root max={1000} min={500} value={700}>
  <div class="flex items-center justify-between gap-2">
    <Meter.Label>Bandwidth (Mbps)</Meter.Label><Meter.Value>
      {#snippet children(_formatted, value)}{value}{/snippet}
    </Meter.Value>
  </div>
  <Meter.Track><Meter.Indicator /></Meter.Track>
</Meter.Root>
