<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  let range = $state<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });
</script>

<Calendar mode="range" bind:selected={range} />
