<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "calendar"],
    id: "p-calendar-21",
    interactive: true,
    responsive: true,
    title: "Calendar range shortcuts",
  });
</script>

<script lang="ts">
  import { Button, Calendar, type DateRange } from "@coss-sv/ui";
  import {
    addCalendarDays,
    endOfCalendarMonth,
    endOfCalendarYear,
    startOfCalendarMonth,
    startOfCalendarYear,
    subtractCalendarMonths,
    subtractCalendarYears,
  } from "../lib/date-format.js";
  const today = new Date();
  const lastMonth = subtractCalendarMonths(today, 1);
  const lastYear = subtractCalendarYears(today, 1);
  const ranges: { label: string; value: DateRange }[] = [
    { label: "Today", value: { from: today, to: today } },
    {
      label: "Yesterday",
      value: { from: addCalendarDays(today, -1), to: addCalendarDays(today, -1) },
    },
    { label: "Last 7 days", value: { from: addCalendarDays(today, -6), to: today } },
    { label: "Last 30 days", value: { from: addCalendarDays(today, -29), to: today } },
    { label: "Month to date", value: { from: startOfCalendarMonth(today), to: today } },
    {
      label: "Last month",
      value: { from: startOfCalendarMonth(lastMonth), to: endOfCalendarMonth(lastMonth) },
    },
    { label: "Year to date", value: { from: startOfCalendarYear(today), to: today } },
    {
      label: "Last year",
      value: { from: startOfCalendarYear(lastYear), to: endOfCalendarYear(lastYear) },
    },
  ];
  let month = $state(today);
  let date = $state<DateRange | undefined>(ranges[2]?.value);
</script>

<div class="flex max-sm:flex-col">
  <div class="relative py-1 ps-1 max-sm:order-1 max-sm:border-t">
    <div class="flex h-full flex-col sm:border-e sm:pe-3">
      {#each ranges as option (option.label)}<Button
          class="w-full justify-start"
          onclick={() => {
            date = option.value;
            month = option.value.to ?? option.value.from ?? today;
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
    mode="range"
    {month}
    onMonthChange={(value) => (month = value)}
    onSelect={(newDate) => {
      if (newDate) date = newDate;
    }}
    selected={date}
  />
</div>
