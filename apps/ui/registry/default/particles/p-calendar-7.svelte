<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-7",
    interactive: true,
    responsive: false,
    title: "Calendar disabled dates",
  });
</script>

<script lang="ts">
  import { Calendar } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  const addDays = (date: Date, days: number) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
</script>

<Calendar
  disabled={[
    { before: today },
    today,
    { dayOfWeek: [0, 6] },
    { from: addDays(today, 14), to: addDays(today, 16) },
    { from: addDays(today, 23), to: addDays(today, 24) },
  ]}
  excludeDisabled
  mode="range"
  {today}
/>
