<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
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
  const today = new Date(2026, 7, 28, 12);
  const day = (offset: number) => new Date(2026, 7, 28 + offset, 12);
  const ranges: { label: string; value: DateRange }[] = [
    { label: "Today", value: { from: today, to: today } },
    { label: "Yesterday", value: { from: day(-1), to: day(-1) } },
    { label: "Last 7 days", value: { from: day(-6), to: today } },
    { label: "Last 30 days", value: { from: day(-29), to: today } },
    { label: "Month to date", value: { from: new Date(2026, 7, 1, 12), to: today } },
    {
      label: "Last month",
      value: { from: new Date(2026, 6, 1, 12), to: new Date(2026, 6, 31, 12) },
    },
    { label: "Year to date", value: { from: new Date(2026, 0, 1, 12), to: today } },
    {
      label: "Last year",
      value: { from: new Date(2025, 0, 1, 12), to: new Date(2025, 11, 31, 12) },
    },
  ];
  let month = $state(today);
  let date = $state<DateRange | undefined>(ranges[2]?.value);
</script>

<div class="flex max-sm:flex-col">
  <div class="relative py-1 ps-1 max-sm:order-1 max-sm:border-t">
    <div class="flex h-full flex-col sm:border-e sm:pe-3">
      {#each ranges as option}<Button
          class="w-full justify-start"
          onclick={() => {
            date = option.value;
            month = option.value.to ?? option.value.from ?? today;
          }}
          size="sm"
          variant="ghost">{option.label}</Button
        >{/each}
    </div>
  </div>
  <Calendar
    class="max-sm:pb-3 sm:ps-5"
    disabled={[{ after: today }]}
    mode="range"
    bind:month
    bind:selected={date}
    {today}
  />
</div>
