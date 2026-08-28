<script lang="ts">
import Calendar from "./calendar.svelte";
import type {
  CalendarDayButtonProps,
  CalendarWeekNumberProps,
  DateRange,
} from "./calendar.types.js";
import * as Popover from "../popover/index.js";

const unavailable = new Date(2026, 0, 20, 12);
let mode = $state<"single" | "multiple" | "range">("single");
let month = $state(new Date(2026, 0, 1, 12));
let singleSelected = $state<Date | undefined>(new Date(2026, 0, 15, 12));
let multipleSelected = $state<Date[] | undefined>();
let rangeSelected = $state<DateRange | undefined>({ from: new Date(2026, 0, 15, 12) });
let changes = $state(0);
let datePickerOpen = $state(false);
let callbackEvidence = $state("");
let overrideEvidence = $state("");
let controlledSelectionCallback = $state("");
let controlledMonthCallback = $state("");
let boundSelection = $state<Date | undefined>(new Date(2026, 0, 15, 12));
let boundMonth = $state(new Date(2026, 0, 1, 12));
let noonSingle = $state<Date | undefined>();
let noonMultiple = $state<Date[] | undefined>();
let noonRange = $state<DateRange | undefined>();
let noonEvidence = $state("");
let oppositeSingle = $state<Date | undefined>();
let oppositeMultiple = $state<Date[] | undefined>();
let oppositeRange = $state<DateRange | undefined>();
let oppositeEvidence = $state("");
let undefinedControlledCallback = $state("");
let dynamicSelection = $state<Date | undefined>();
let dynamicSelectionControlled = $state(false);
let dynamicSelectionCallback = $state("");
let dynamicMonthControlled = $state(false);
const selection = $derived(
  mode === "single" ? singleSelected : mode === "multiple" ? multipleSelected : rangeSelected,
);

function setMode(next: "single" | "multiple" | "range") {
  mode = next;
  if (next === "single") singleSelected = undefined;
  if (next === "multiple") multipleSelected = undefined;
  if (next === "range") rangeSelected = { from: new Date(2026, 0, 15, 12) };
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function selectionText(value: Date | Date[] | DateRange | undefined): string {
  if (value instanceof Date) return localDateKey(value);
  if (Array.isArray(value)) return value.map(localDateKey).join(",");
  if (!value) return "";
  return [value.from && localDateKey(value.from), value.to && localDateKey(value.to)]
    .filter(Boolean)
    .join("–");
}

function ignoreDynamicSelection(value: Date | undefined): void {
  dynamicSelectionCallback = value ? localDateKey(value) : "cleared";
}
</script>

{#snippet customDayButton(props: CalendarDayButtonProps)}
  <button
    aria-label={props["aria-label"]}
    class={props.class}
    data-calendar-date={props["data-calendar-date"]}
    data-custom-day-button=""
    disabled={props.disabled}
    onclick={props.onclick}
    onfocus={props.onfocus}
    onkeydown={props.onkeydown}
    tabindex={props.tabindex}
    type="button"
  >
    {@render props.children()}
  </button>
{/snippet}

{#snippet customWeekNumber(props: CalendarWeekNumberProps)}
  <th
    aria-label={props["aria-label"]}
    class={props.class}
    data-custom-week-number={props.week.weekNumber}
    role={props.role}
    scope={props.scope}
  >
    {@render props.children()}
  </th>
{/snippet}

<button data-testid="single-mode" onclick={() => setMode("single")} type="button">Single</button>
<button data-testid="multiple-mode" onclick={() => setMode("multiple")} type="button">
  Multiple
</button>
<button data-testid="range-mode" onclick={() => setMode("range")} type="button">Range</button>
<button
  data-testid="external-out-of-bounds-month"
  onclick={() => (month = new Date(2040, 0, 1, 12))}
  type="button"
>
  Set out-of-bounds month
</button>

{#if mode === "single"}
  <Calendar
    aria-label="Interactive calendar"
    data-testid="interactive-calendar"
    bind:month
    bind:selected={singleSelected}
    captionLayout="dropdown"
    disabled={[new Date(2026, 0, 18, 12)]}
    endMonth={new Date(2027, 11, 1, 12)}
    fixedWeeks
    mode="single"
    onMonthChange={(nextMonth) => {
      month = nextMonth;
      changes += 1;
    }}
    onDayClick={(date, modifiers, event) => {
      callbackEvidence += `day:${date.getDate()}:${modifiers.selected}:${event.type}`;
    }}
    onSelect={(value, date, modifiers, event) => {
      singleSelected = value;
      changes += 1;
      callbackEvidence = `select:${date.getDate()}:${modifiers.selected}:${event.type}|`;
    }}
    startMonth={new Date(2025, 0, 1, 12)}
    {unavailable}
  />
{:else if mode === "multiple"}
  <Calendar
    aria-label="Interactive calendar"
    data-testid="interactive-calendar"
    bind:month
    bind:selected={multipleSelected}
    captionLayout="dropdown"
    disabled={[new Date(2026, 0, 18, 12)]}
    endMonth={new Date(2027, 11, 1, 12)}
    fixedWeeks
    mode="multiple"
    onMonthChange={(nextMonth) => {
      month = nextMonth;
      changes += 1;
    }}
    onSelect={(value) => {
      multipleSelected = value;
      changes += 1;
    }}
    startMonth={new Date(2025, 0, 1, 12)}
    {unavailable}
  />
{:else}
  <Calendar
    aria-label="Interactive calendar"
    data-testid="interactive-calendar"
    bind:month
    bind:selected={rangeSelected}
    captionLayout="dropdown"
    disabled={[new Date(2026, 0, 18, 12)]}
    endMonth={new Date(2027, 11, 1, 12)}
    fixedWeeks
    mode="range"
    onMonthChange={(nextMonth) => {
      month = nextMonth;
      changes += 1;
    }}
    onSelect={(value) => {
      rangeSelected = value;
      changes += 1;
    }}
    startMonth={new Date(2025, 0, 1, 12)}
    {unavailable}
  />
{/if}

<output data-testid="month">{month.getFullYear()}-{month.getMonth() + 1}</output>
<output data-testid="selection">{selectionText(selection)}</output>
<output data-testid="changes">{changes}</output>
<output data-testid="callback-evidence">{callbackEvidence}</output>

<div data-testid="controlled-selection-calendar">
  <Calendar
    defaultMonth={new Date(2026, 0, 1, 12)}
    mode="single"
    onSelect={(value) => {
      controlledSelectionCallback = value ? localDateKey(value) : "cleared";
    }}
    selected={new Date(2026, 0, 15, 12)}
  />
</div>
<output data-testid="controlled-selection-callback">{controlledSelectionCallback}</output>

<div data-testid="controlled-month-calendar">
  <Calendar
    month={new Date(2026, 0, 1, 12)}
    onMonthChange={(value) => {
      controlledMonthCallback = localDateKey(value);
    }}
  />
</div>
<output data-testid="controlled-month-callback">{controlledMonthCallback}</output>

<div data-testid="bound-selection-calendar">
  <Calendar bind:selected={boundSelection} defaultMonth={new Date(2026, 0, 1, 12)} mode="single" />
</div>
<output data-testid="bound-selection">{selectionText(boundSelection)}</output>

<div data-testid="bound-month-calendar">
  <Calendar
    bind:month={boundMonth}
    onMonthChange={(value) => {
      boundMonth = value;
    }}
  />
</div>
<output data-testid="bound-month"> {boundMonth.getFullYear()}-{boundMonth.getMonth() + 1} </output>

<div data-testid="undefined-controlled-selection-calendar">
  <Calendar
    defaultMonth={new Date(2026, 0, 1, 12)}
    mode="single"
    onSelect={(value) => {
      undefinedControlledCallback = value ? localDateKey(value) : "cleared";
    }}
  />
</div>
<output data-testid="undefined-controlled-selection-callback">
  {undefinedControlledCallback}
</output>

<div data-testid="month-without-callback-calendar">
  <Calendar month={new Date(2026, 0, 1, 12)} />
</div>

<button
  data-testid="toggle-dynamic-selection-control"
  onclick={() => (dynamicSelectionControlled = !dynamicSelectionControlled)}
  type="button"
>
  Toggle selection control
</button>
<div data-testid="dynamic-selection-calendar">
  <Calendar
    {...(dynamicSelectionControlled ? { onSelect: ignoreDynamicSelection } : {})}
    bind:selected={dynamicSelection}
    defaultMonth={new Date(2026, 0, 1, 12)}
    mode="single"
  />
</div>
<output data-testid="dynamic-selection">{selectionText(dynamicSelection)}</output>
<output data-testid="dynamic-selection-callback">{dynamicSelectionCallback}</output>

<button
  data-testid="toggle-dynamic-month-control"
  onclick={() => (dynamicMonthControlled = !dynamicMonthControlled)}
  type="button"
>
  Toggle month control
</button>
<div data-testid="dynamic-month-calendar">
  <Calendar
    {...(dynamicMonthControlled ? { month: new Date(2026, 0, 1, 12) } : {})}
    defaultMonth={new Date(2026, 0, 1, 12)}
  />
</div>

<div data-testid="noon-single-calendar">
  <Calendar
    bind:selected={noonSingle}
    defaultMonth={new Date("2026-01-01T01:30:00.000Z")}
    mode="single"
    noonSafe
    onSelect={(value) => {
      noonSingle = value;
      noonEvidence = `single:${selectionText(value)}:${value?.getHours()}`;
    }}
    timeZone="Etc/GMT+12"
  />
</div>
<div data-testid="noon-multiple-calendar">
  <Calendar
    bind:selected={noonMultiple}
    defaultMonth={new Date("2026-01-01T01:30:00.000Z")}
    mode="multiple"
    noonSafe
    onSelect={(value) => {
      noonMultiple = value;
      noonEvidence += `|multiple:${selectionText(value)}:${value?.[0]?.getHours()}`;
    }}
    timeZone="Etc/GMT+12"
  />
</div>
<div data-testid="noon-range-calendar">
  <Calendar
    bind:selected={noonRange}
    defaultMonth={new Date("2026-01-01T01:30:00.000Z")}
    mode="range"
    noonSafe
    onSelect={(value) => {
      noonRange = value;
      noonEvidence += `|range:${selectionText(value)}:${value?.from?.getHours()}:${value?.to?.getHours()}`;
    }}
    timeZone="Etc/GMT+12"
  />
</div>
<output data-testid="noon-evidence">{noonEvidence}</output>

<div data-testid="opposite-single-calendar">
  <Calendar
    bind:selected={oppositeSingle}
    defaultMonth={new Date("2026-01-01T11:00:00.000Z")}
    mode="single"
    noonSafe
    onSelect={(value) => {
      oppositeSingle = value;
      oppositeEvidence = `single:${selectionText(value)}:${value?.getHours()}`;
    }}
    timeZone="Pacific/Kiritimati"
  />
</div>
<div data-testid="opposite-multiple-calendar">
  <Calendar
    bind:selected={oppositeMultiple}
    defaultMonth={new Date("2026-01-01T11:00:00.000Z")}
    mode="multiple"
    noonSafe
    onSelect={(value) => {
      oppositeMultiple = value;
      oppositeEvidence += `|multiple:${selectionText(value)}:${value?.[0]?.getHours()}`;
    }}
    timeZone="Pacific/Kiritimati"
  />
</div>
<div data-testid="opposite-range-calendar">
  <Calendar
    bind:selected={oppositeRange}
    defaultMonth={new Date("2026-01-01T11:00:00.000Z")}
    mode="range"
    noonSafe
    onSelect={(value) => {
      oppositeRange = value;
      oppositeEvidence += `|range:${selectionText(value)}:${value?.from?.getHours()}:${value?.to?.getHours()}`;
    }}
    timeZone="Pacific/Kiritimati"
  />
</div>
<output data-testid="opposite-evidence">{oppositeEvidence}</output>

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

<div data-testid="disabled-focus-calendar">
  <Calendar
    defaultMonth={new Date(2026, 0, 1)}
    disabled={[new Date(2026, 0, 15)]}
    mode="single"
    selected={new Date(2026, 0, 15)}
  />
</div>

<div data-testid="override-calendar">
  <Calendar
    components={{ DayButton: customDayButton, WeekNumber: customWeekNumber }}
    defaultMonth={new Date(2026, 0, 1)}
    mode="single"
    onDayClick={(date, modifiers, event) => {
      overrideEvidence = `${date.getDate()}:${modifiers.selected}:${event.type}`;
    }}
    showWeekNumber
  />
  <output data-testid="override-evidence">{overrideEvidence}</output>
</div>

<div data-testid="reverse-calendar">
  <Calendar
    captionLayout="dropdown"
    defaultMonth={new Date(2026, 11, 1)}
    endMonth={new Date(2028, 11, 1)}
    mode="single"
    numberOfMonths={2}
    reverseMonths
    startMonth={new Date(2025, 0, 1)}
  />
</div>

<div data-testid="exhaustion-calendar">
  <Calendar
    defaultMonth={new Date(2026, 0, 1)}
    disabled={{ after: new Date(2026, 0, 15) }}
    endMonth={new Date(2026, 0, 1)}
    mode="single"
    selected={new Date(2026, 0, 15)}
    startMonth={new Date(2026, 0, 1)}
  />
</div>
