<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-22",
    interactive: true,
    responsive: true,
    title: "Two-month calendar range",
    colSpan: 2,
  });
</script>

<script lang="ts">
  import { Calendar, type DateRange } from "@coss-sv/ui";
  import { addCalendarDays } from "../lib/date-format.js";
  const today = new Date();
  let date = $state<DateRange | undefined>({ from: today, to: addCalendarDays(today, 25) });
</script>

<Calendar
  classNames={{
    month:
      "relative first-of-type:before:hidden before:absolute max-sm:before:inset-x-2 max-sm:before:h-px max-sm:before:-top-2 sm:before:inset-y-2 sm:before:w-px before:bg-border sm:before:-left-4",
    months: "gap-8",
  }}
  mode="range"
  numberOfMonths={2}
  bind:selected={date}
  pagedNavigation
  showOutsideDays={false}
/>
