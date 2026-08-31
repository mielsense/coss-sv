<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-8",
    interactive: true,
    responsive: false,
    title: "Calendar multiple selection",
  });
</script>

<script lang="ts">
  import { Calendar } from "@coss-sv/ui";
  import { addCalendarDays } from "../lib/date-format.js";
  const today = new Date();
  let date = $state<Date[] | undefined>([
    addCalendarDays(today, -17),
    addCalendarDays(today, 2),
    addCalendarDays(today, 6),
    addCalendarDays(today, 8),
  ]);
</script>

<Calendar mode="multiple" bind:selected={date} />
