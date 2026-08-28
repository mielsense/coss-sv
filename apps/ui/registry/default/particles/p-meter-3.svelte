<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["meter"],
    id: "p-meter-3",
    interactive: false,
    responsive: false,
    title: "Formatted rating meter",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Meter } from "@coss-sv/ui";
</script>

<Meter.Root max={5} value={3}
  ><div class="flex items-center justify-between gap-2">
    <Meter.Label>Rating</Meter.Label><Meter.Value
      >{#snippet children(_formatted, value)}{value} / 5{/snippet}</Meter.Value
    >
  </div>
  <Meter.Track><Meter.Indicator /></Meter.Track></Meter.Root
>
