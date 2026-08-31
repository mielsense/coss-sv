<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  import { addCalendarDays } from "../lib/date-format.js";
  const today = new Date();
</script>

<Calendar
  disabled={[
    { before: today },
    today,
    { dayOfWeek: [0, 6] },
    { from: addCalendarDays(today, 14), to: addCalendarDays(today, 16) },
    { from: addCalendarDays(today, 23), to: addCalendarDays(today, 24) },
  ]}
  excludeDisabled
  mode="range"
/>
