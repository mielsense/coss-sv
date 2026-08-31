<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-10",
    interactive: true,
    responsive: false,
    title: "Rounded calendar range",
  });
</script>

<script lang="ts">
  import { Calendar, type DateRange } from "@coss-sv/ui";
  import { addCalendarDays } from "../lib/date-format.js";
  const today = new Date();
  let date = $state<DateRange | undefined>({ from: today, to: addCalendarDays(today, 3) });
</script>

<Calendar
  classNames={{
    day: "relative before:absolute before:inset-y-px before:inset-x-0 [&.range-start:not(.range-end):before]:bg-linear-to-end before:from-transparent before:from-50% before:to-accent before:to-50% [&.range-end:not(.range-start):before]:bg-linear-to-start",
    day_button:
      "rounded-full group-[.range-start:not(.range-end)]:rounded-e-full group-[.range-end:not(.range-start)]:rounded-s-full",
  }}
  mode="range"
  bind:selected={date}
/>
