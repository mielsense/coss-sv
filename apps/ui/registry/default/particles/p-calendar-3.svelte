<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-3",
    interactive: true,
    responsive: false,
    title: "Calendar range selection",
  });
</script>

<script lang="ts">
  import { Calendar, type DateRange } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let range = $state<DateRange | undefined>({ from: today, to: new Date(2026, 8, 4, 12) });
</script>

<Calendar mode="range" bind:selected={range} {today} />
