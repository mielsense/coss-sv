<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-4",
    interactive: true,
    responsive: false,
    title: "Calendar dropdown caption",
  });
</script>

<script lang="ts">
  import { Calendar } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>(today);
</script>

<Calendar
  captionLayout="dropdown"
  endMonth={new Date(2030, 11, 1, 12)}
  mode="single"
  bind:selected={date}
  startMonth={new Date(1930, 0, 1, 12)}
  {today}
/>
