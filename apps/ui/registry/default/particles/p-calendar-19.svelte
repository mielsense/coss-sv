<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar", "scroll-area", "toggle", "toggle-group"],
    id: "p-calendar-19",
    interactive: true,
    responsive: true,
    title: "Calendar appointment times",
  });
</script>

<script lang="ts">
  import { Calendar, ScrollArea, Toggle, ToggleGroup } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state(today);
  let time = $state<string | null>(null);
  const slots = [
    { available: false, time: "09:00" },
    { available: false, time: "09:30" },
    { available: true, time: "10:00" },
    { available: true, time: "10:30" },
    { available: true, time: "11:00" },
    { available: true, time: "11:30" },
    { available: false, time: "12:00" },
    { available: true, time: "12:30" },
    { available: true, time: "13:00" },
    { available: true, time: "13:30" },
    { available: true, time: "14:00" },
    { available: false, time: "14:30" },
    { available: false, time: "15:00" },
    { available: true, time: "15:30" },
    { available: true, time: "16:00" },
    { available: true, time: "16:30" },
    { available: true, time: "17:00" },
    { available: true, time: "17:30" },
  ];
  const weekday = $derived(
    `${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date)}, ${date.getDate()}`,
  );
</script>

<div class="flex max-sm:flex-col">
  <Calendar
    class="max-sm:pb-3 sm:pe-5"
    disabled={[{ before: today }]}
    mode="single"
    selected={date}
    onSelect={(next) => {
      if (next) {
        date = next;
        time = null;
      }
    }}
    {today}
  />
  <div class="relative w-full max-sm:h-48 sm:w-40">
    <div class="absolute inset-0 max-sm:border-t">
      <ScrollArea class="h-full sm:border-s" overscrollContain scrollbarGutter scrollFade
        ><div class="flex flex-col gap-3 py-3 sm:pt-0 sm:pb-2">
          <div class="flex shrink-0 items-center font-medium text-sm sm:h-8 sm:px-5">{weekday}</div>
          <ToggleGroup.Root
            class="grid w-full gap-1.5 max-sm:grid-cols-2 sm:px-5"
            value={time ? [time] : []}
            onValueChange={(values) => (time = values[0] ?? null)}
            >{#each slots as slot (slot.time)}<Toggle
                disabled={!slot.available}
                size="sm"
                value={slot.time}
                variant="outline">{slot.time}</Toggle
              >{/each}</ToggleGroup.Root
          >
        </div></ScrollArea
      >
    </div>
  </div>
</div>
