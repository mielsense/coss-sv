<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "calendar"],
    id: "p-calendar-20",
    interactive: true,
    responsive: true,
    title: "Calendar date shortcuts",
  });
</script>

<script lang="ts">
  import { Button, Calendar } from "@coss-sv/ui";
  import {
    addCalendarDays,
    subtractCalendarMonths,
    subtractCalendarYears,
  } from "../lib/date-format.js";
  const today = new Date();
  const dates = [
    { label: "Today", date: today },
    { label: "Yesterday", date: addCalendarDays(today, -1) },
    { label: "Last week", date: addCalendarDays(today, -7) },
    { label: "Last month", date: subtractCalendarMonths(today, 1) },
    { label: "Last year", date: subtractCalendarYears(today, 1) },
  ];
  let month = $state(today);
  let date = $state(today);
</script>

<div class="flex max-sm:flex-col">
  <div class="relative py-1 ps-1 max-sm:order-1 max-sm:border-t">
    <div class="flex h-full flex-col sm:border-e sm:pe-3">
      {#each dates as option (option.label)}<Button
          class="w-full justify-start"
          onclick={() => {
            date = option.date;
            month = option.date;
          }}
          size="sm"
          variant="ghost"
        >
          {option.label}
        </Button>{/each}
    </div>
  </div>
  <Calendar
    class="max-sm:pb-3 sm:ps-5"
    disabled={[{ after: today }]}
    mode="single"
    {month}
    onMonthChange={(value) => (month = value)}
    onSelect={(newDate) => {
      if (newDate) date = newDate;
    }}
    selected={date}
  />
</div>
