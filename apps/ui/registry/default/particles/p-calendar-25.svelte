<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["autocomplete", "calendar", "field"],
    id: "p-calendar-25",
    interactive: true,
    responsive: false,
    title: "Calendar autocomplete time input",
  });

  export function parseTime(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const colonMatch = /^(\d{1,2}):(\d{1,2})$/.exec(trimmed);
    if (colonMatch) {
      const hours = Number(colonMatch[1]);
      const minutes = Number(colonMatch[2]);
      if (hours > 23 || minutes > 59) return null;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }

    const digits = trimmed.replace(/\D/g, "");
    if (digits.length === 0 || digits.length > 4) return null;

    let hours: number;
    let minutes: number;
    if (digits.length <= 2) {
      hours = Number(digits);
      minutes = 0;
    } else if (digits.length === 3) {
      hours = Number(digits[0]);
      minutes = Number(digits.slice(1));
    } else {
      hours = Number(digits.slice(0, 2));
      minutes = Number(digits.slice(2));
    }

    if (hours > 23 || minutes > 59) return null;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  export function formatTimeInput(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;

    if (digits.length === 3) {
      const minutes = Number(digits.slice(1));
      return minutes <= 59 ? `${digits[0]}:${digits.slice(1)}` : digits;
    }

    return parseTime(digits) ?? digits;
  }

  export function filterTime(item: string, query: string): boolean {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return true;
    if (item.toLowerCase().startsWith(trimmed)) return true;

    const itemDigits = item.replace(/\D/g, "");
    const queryDigits = trimmed.replace(/\D/g, "");
    if (!queryDigits) return false;

    const itemHour = Number(itemDigits.slice(0, 2));
    const itemMinutes = itemDigits.slice(2);
    const itemDigitsUnpadded = `${itemHour}${itemMinutes}`;

    if (itemDigits.startsWith(queryDigits) || itemDigitsUnpadded.startsWith(queryDigits)) {
      return true;
    }

    if (queryDigits.length >= 3) return parseTime(queryDigits) === item;

    const queryHour = Number(queryDigits);
    if (trimmed.includes(":")) {
      const minuteQuery = trimmed.split(":")[1]?.replace(/\D/g, "") ?? "";
      return itemHour === queryHour && (!minuteQuery || itemMinutes.startsWith(minuteQuery));
    }

    if (queryDigits.length === 1) {
      return itemHour === queryHour || String(itemHour).startsWith(queryDigits);
    }

    return queryHour <= 23 && itemHour === queryHour;
  }

  export function applyTime(date: Date, time: string): Date {
    const parsed = parseTime(time);
    if (!parsed) return date;
    const next = new Date(date);
    next.setHours(Number(parsed.slice(0, 2)), Number(parsed.slice(3, 5)), 0, 0);
    return next;
  }
</script>

<script lang="ts">
  import { Clock01Icon } from "@hugeicons/core-free-icons";
  import { Autocomplete, Calendar, Field, HugeiconsIcon } from "@coss-sv/ui";
  const times = Array.from(
    { length: 96 },
    (_, index) =>
      `${String(Math.floor(index / 4)).padStart(2, "0")}:${String((index % 4) * 15).padStart(2, "0")}`,
  );
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>(today);
  let month = $state(today);
  let time = $state("12:00");
  let isEditing = $state(false);

  const filterQuery = $derived(isEditing ? time : "");
  const matchingTimes = $derived(times.filter((item) => filterTime(item, filterQuery)));

  function handleDaySelect(selectedDate: Date | undefined): void {
    if (!selectedDate) {
      date = undefined;
      return;
    }
    const next = applyTime(selectedDate, time);
    date = next;
    month = next;
  }

  function handleTimeChange(value: string): void {
    isEditing = true;
    const next = formatTimeInput(value);
    time = next;
    if (date && /^\d{2}:\d{2}$/.test(next)) date = applyTime(date, next);
  }

  function handleTimeBlur(): void {
    const normalized = parseTime(time);
    if (normalized) {
      time = normalized;
      if (date) date = applyTime(date, normalized);
    } else if (date) {
      time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
    isEditing = false;
  }
</script>

{#snippet clock()}<HugeiconsIcon icon={Clock01Icon} aria-hidden="true" strokeWidth={2} />{/snippet}

<div class="flex w-fit flex-col gap-2">
  <Calendar
    mode="single"
    bind:month
    selected={date}
    onSelect={handleDaySelect}
    {today}
  /><Field.Root class="w-0 min-w-full flex-row items-center gap-3"
    ><Field.Label class="whitespace-nowrap text-xs">Enter time</Field.Label><Autocomplete.Root
      autoHighlight
      bind:value={() => time, handleTimeChange}
      filter={(item: string, query: string) => filterTime(item, isEditing ? query : "")}
      items={times}
      openOnInputClick
      ><Autocomplete.Input
        aria-label="Enter time"
        inputmode="numeric"
        maxlength={5}
        onblur={handleTimeBlur}
        onfocus={(event) => {
          isEditing = false;
          event.currentTarget.select();
        }}
        placeholder="HH:mm"
        startAddon={clock}
      /><Autocomplete.Popup class={matchingTimes.length === 0 ? "hidden" : undefined}
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
