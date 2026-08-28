<script lang="ts">
import Calendar from "./calendar.svelte";
import type { CalendarSelection, DateRange } from "./calendar.types.js";
import * as Popover from "../popover/index.js";

const unavailable = new Date(2026, 0, 20, 12);
let mode = $state<"single" | "multiple" | "range">("single");
let month = $state(new Date(2026, 0, 1, 12));
let selected = $state<CalendarSelection>(new Date(2026, 0, 15, 12));
let changes = $state(0);
let datePickerOpen = $state(false);

function setMode(next: "single" | "multiple" | "range") {
  mode = next;
  selected =
    next === "range" ? ({ from: new Date(2026, 0, 15, 12) } satisfies DateRange) : undefined;
}
</script>

<button data-testid="single-mode" onclick={() => setMode("single")} type="button">Single</button>
<button data-testid="multiple-mode" onclick={() => setMode("multiple")} type="button">
  Multiple
</button>
<button data-testid="range-mode" onclick={() => setMode("range")} type="button">Range</button>

<Calendar
  aria-label="Interactive calendar"
  bind:month
  bind:selected
  captionLayout="dropdown"
  disabled={[new Date(2026, 0, 18, 12)]}
  endMonth={new Date(2027, 11, 1, 12)}
  fixedWeeks
  {mode}
  onMonthChange={() => (changes += 1)}
  onSelect={() => (changes += 1)}
  startMonth={new Date(2025, 0, 1, 12)}
  {unavailable}
/>

<output data-testid="month">{month.getFullYear()}-{month.getMonth() + 1}</output>
<output data-testid="selection">{JSON.stringify(selected)}</output>
<output data-testid="changes">{changes}</output>

<Popover.Root bind:open={datePickerOpen}>
  <Popover.Trigger data-testid="date-picker-trigger">Pick a date</Popover.Trigger>
  <Popover.Popup data-testid="date-picker-popup">
    <Calendar
      aria-label="Date picker calendar"
      defaultMonth={new Date(2026, 0, 1, 12)}
      mode="single"
      onSelect={() => (datePickerOpen = false)}
    />
  </Popover.Popup>
</Popover.Root>
