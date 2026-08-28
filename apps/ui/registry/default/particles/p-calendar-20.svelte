<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
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
  const today = new Date(2026, 7, 28, 12);
  const shift = (days: number) => new Date(2026, 7, 28 + days, 12);
  const dates = [
    { label: "Today", date: today },
    { label: "Yesterday", date: shift(-1) },
    { label: "Last week", date: shift(-7) },
    { label: "Last month", date: new Date(2026, 6, 28, 12) },
    { label: "Last year", date: new Date(2025, 7, 28, 12) },
  ];
  let month = $state(today);
  let date = $state<Date | undefined>(today);
</script>

<div class="flex max-sm:flex-col">
  <div class="relative py-1 ps-1 max-sm:order-1 max-sm:border-t">
    <div class="flex h-full flex-col sm:border-e sm:pe-3">
      {#each dates as option}<Button
          class="w-full justify-start"
          onclick={() => {
            date = option.date;
            month = option.date;
          }}
          size="sm"
          variant="ghost">{option.label}</Button
        >{/each}
    </div>
  </div>
  <Calendar
    class="max-sm:pb-3 sm:ps-5"
    disabled={[{ after: today }]}
    mode="single"
    bind:month
    bind:selected={date}
    {today}
  />
</div>
