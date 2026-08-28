<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-23",
    interactive: true,
    responsive: true,
    title: "Three-month calendar range",
    colSpan: 2,
  });
</script>

<script lang="ts">
  import { Calendar, type DateRange } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<DateRange | undefined>({ from: today, to: new Date(2026, 9, 15, 12) });
</script>

<Calendar
  classNames={{
    month:
      "relative first-of-type:before:hidden before:absolute max-md:before:inset-x-2 max-md:before:h-px max-md:before:-top-4 md:before:inset-y-2 md:before:w-px before:bg-border md:before:-left-4",
    months: "sm:flex-col md:flex-row gap-8",
  }}
  mode="range"
  numberOfMonths={3}
  bind:selected={date}
  pagedNavigation
  showOutsideDays={false}
  {today}
/>
