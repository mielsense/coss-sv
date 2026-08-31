<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "calendar"],
    id: "p-calendar-16",
    interactive: true,
    responsive: false,
    title: "Calendar today control",
  });
</script>

<script lang="ts">
  import { Button, Calendar } from "@coss-sv/ui";
  import { addCalendarDays } from "../lib/date-format.js";
  const today = new Date();
  const selectedDay = addCalendarDays(today, -28);
  let month = $state(selectedDay);
  let date = $state<Date | undefined>(selectedDay);
</script>

<div class="flex flex-col items-start gap-2">
  <Calendar
    mode="single"
    {month}
    onMonthChange={(value) => (month = value)}
    bind:selected={date}
  /><Button
    onclick={() => {
      date = today;
      month = today;
    }}
    size="sm"
    variant="outline"
  >
    Today
  </Button>
</div>
