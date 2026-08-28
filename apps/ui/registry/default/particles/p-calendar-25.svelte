<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["autocomplete", "calendar", "field"],
    id: "p-calendar-25",
    interactive: true,
    responsive: false,
    title: "Calendar autocomplete time input",
  });
</script>

<script lang="ts">
  import { Clock01Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { Autocomplete, Calendar, Field } from "@coss-sv/ui";
  const times = Array.from(
    { length: 96 },
    (_, index) =>
      `${String(Math.floor(index / 4)).padStart(2, "0")}:${String((index % 4) * 15).padStart(2, "0")}`,
  );
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>(today);
  let month = $state(today);
  let time = $state("12:00");
  function parseTime(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (!digits) return null;
    const hours = Number(digits.length <= 2 ? digits : digits.slice(0, -2));
    const minutes = digits.length <= 2 ? 0 : Number(digits.slice(-2));
    return hours <= 23 && minutes <= 59
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
      : null;
  }
  function applyTime(value: Date, selectedTime: string) {
    const parsed = parseTime(selectedTime);
    if (!parsed) return value;
    const next = new Date(value);
    next.setHours(Number(parsed.slice(0, 2)), Number(parsed.slice(3)), 0, 0);
    return next;
  }
</script>

{#snippet clock()}<HugeiconsIcon icon={Clock01Icon} aria-hidden="true" />{/snippet}

<div class="flex w-fit flex-col gap-2">
  <Calendar
    mode="single"
    bind:month
    selected={date}
    onSelect={(next) => {
      if (next) {
        date = applyTime(next, time);
        month = next;
      }
    }}
    {today}
  /><Field.Root class="w-0 min-w-full flex-row items-center gap-3"
    ><Field.Label class="whitespace-nowrap text-xs">Enter time</Field.Label><Autocomplete.Root
      autoHighlight
      items={times}
      onValueChange={(value) => {
        if (typeof value === "string") {
          time = value;
          if (date) date = applyTime(date, value);
        }
      }}
      openOnInputClick
      value={time}
      ><Autocomplete.Input
        aria-label="Enter time"
        inputMode="numeric"
        maxLength={5}
        placeholder="HH:mm"
        startAddon={clock}
      /><Autocomplete.Popup
        ><Autocomplete.List
          ><Autocomplete.Collection
            >{#snippet children(item: string)}<Autocomplete.Item value={item}
                >{item}</Autocomplete.Item
              >{/snippet}</Autocomplete.Collection
          ></Autocomplete.List
        ></Autocomplete.Popup
      ></Autocomplete.Root
    ></Field.Root
  >
</div>
