<!-- biome-ignore-all lint/a11y/noNoninteractiveElementToInteractiveRole: COSS and the WAI-ARIA calendar grid pattern use grid roles on table elements. -->
<script module lang="ts">
import type { CalendarClassNames } from "./calendar.types.js";

const buttonClassNames =
  "relative flex size-(--cell-size) text-base sm:text-sm items-center justify-center rounded-lg text-foreground not-in-data-selected:hover:bg-accent disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";

export const calendarDefaultClassNames = {
  button_next: buttonClassNames,
  button_previous: buttonClassNames,
  caption_label: "text-base sm:text-sm font-medium flex items-center gap-2 h-full",
  day: "size-(--cell-size) text-sm py-px",
  day_button: `${buttonClassNames} in-data-disabled:pointer-events-none in-[.range-middle]:rounded-none in-[.range-end:not(.range-start)]:rounded-s-none in-[.range-start:not(.range-end)]:rounded-e-none in-[.range-middle]:in-data-selected:bg-accent in-data-selected:bg-primary in-[.range-middle]:in-data-selected:text-foreground in-data-disabled:text-muted-foreground/72 in-data-outside:text-muted-foreground/72 in-data-selected:in-data-outside:text-primary-foreground in-data-selected:text-primary-foreground in-data-disabled:line-through outline-none in-[[data-selected]:not(.range-middle)]:transition-[border-radius,box-shadow] focus-visible:z-1 focus-visible:ring-[3px] focus-visible:ring-ring/50`,
  dropdown: "absolute bg-popover inset-0 opacity-0",
  dropdown_root:
    "relative has-focus:border-ring has-focus:ring-ring/50 has-focus:ring-[3px] border border-input shadow-xs/5 rounded-lg px-[calc(--spacing(3)-1px)] h-9 sm:h-8 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-me-1",
  dropdowns:
    "w-full flex items-center text-base sm:text-sm justify-center h-(--cell-size) gap-1.5 *:[span]:font-medium",
  hidden: "invisible",
  month: "w-full",
  month_caption:
    "relative mx-(--cell-size) px-1 mb-1 flex h-(--cell-size) items-center justify-center z-2",
  months: "relative flex flex-col sm:flex-row gap-2",
  nav: "absolute top-0 flex w-full justify-between z-1",
  outside: "text-muted-foreground data-selected:bg-accent/50 data-selected:text-muted-foreground",
  range_end: "range-end",
  range_middle: "range-middle",
  range_start: "range-start",
  today:
    "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-1 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30",
  week_number: "size-(--cell-size) p-0 text-xs font-medium text-muted-foreground/72",
  weekday: "size-(--cell-size) p-0 text-xs font-medium text-muted-foreground/72",
} satisfies CalendarClassNames;
</script>

<script lang="ts">
import { ArrowLeft01Icon, ArrowRight01Icon, ArrowUpDownIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { tick, untrack } from "svelte";
import { cn } from "$lib/utils.js";
import type {
  CalendarDayContext,
  CalendarDropdownContext,
  CalendarProps,
  CalendarSelection,
  DateRange,
} from "./calendar.types.js";
import {
  addCalendarDays,
  addCalendarMonths,
  buildCalendarMonth,
  compareCalendarDays,
  differenceInCalendarDays,
  getIsoWeekNumber,
  getRangeFlags,
  isDateMatched,
  isSameCalendarDay,
  isSelectedDate,
  normalizeCalendarDate,
  resolveSelection,
  startOfCalendarMonth,
} from "./calendar.utils.js";

const today = normalizeCalendarDate(new Date());

let {
  captionLayout = "label",
  class: className,
  className: legacyClassName,
  classNames = {},
  components = {},
  day,
  defaultMonth,
  defaultSelected,
  disabled,
  endMonth,
  excludeDisabled = false,
  fixedWeeks = false,
  formatters = {},
  hideNavigation = false,
  locale = "en-US",
  max,
  maxDate,
  min,
  minDate,
  mode = "single",
  modifiers = {},
  month = $bindable(),
  numberOfMonths = 1,
  onDayClick,
  onMonthChange,
  onSelect,
  pagedNavigation = false,
  ref = $bindable(null),
  required = false,
  reverseMonths = false,
  selected = $bindable<CalendarSelection>(defaultSelected),
  showOutsideDays = true,
  showWeekNumber = false,
  startMonth,
  unavailable,
  weekNumber,
  weekStartsOn = 0,
  ...props
}: CalendarProps = $props();

const initialSelected = untrack(() => selected ?? defaultSelected);
const initialMonth = untrack(() =>
  startOfCalendarMonth(defaultMonth ?? selectedAnchor(initialSelected) ?? today),
);
const initialFocusedDate = untrack(() =>
  normalizeCalendarDate(selectedAnchor(initialSelected) ?? initialMonth),
);
let uncontrolledMonth = $state(initialMonth);
let focusedDate = $state(initialFocusedDate);

const displayMonth = $derived(startOfCalendarMonth(month ?? uncontrolledMonth));
const monthCount = $derived(Math.max(1, Math.floor(numberOfMonths)));
const displayedMonths = $derived.by(() => {
  const values = Array.from({ length: monthCount }, (_, index) =>
    buildCalendarMonth(addCalendarMonths(displayMonth, index), { fixedWeeks, weekStartsOn }),
  );
  return reverseMonths ? values.reverse() : values;
});
const resolvedClassNames = $derived.by(() => {
  const result: Record<string, string> = {};
  for (const [part, base] of Object.entries(calendarDefaultClassNames)) {
    result[part] = cn(base, classNames[part]);
  }
  for (const [part, value] of Object.entries(classNames)) {
    if (!(part in result) && value) result[part] = value;
  }
  return result;
});
const formatterOptions = $derived({ locale });
const weekdayDates = $derived(
  Array.from({ length: 7 }, (_, index) =>
    addCalendarDays(new Date(2026, 0, 4, 12), weekStartsOn + index),
  ),
);
const normalizedStartMonth = $derived(startMonth ? startOfCalendarMonth(startMonth) : undefined);
const normalizedEndMonth = $derived(endMonth ? startOfCalendarMonth(endMonth) : undefined);
const latestDisplayMonth = $derived(
  normalizedEndMonth ? addCalendarMonths(normalizedEndMonth, -(monthCount - 1)) : undefined,
);
const previousStep = $derived(pagedNavigation ? monthCount : 1);
const canGoPrevious = $derived(
  !normalizedStartMonth ||
    compareCalendarDays(addCalendarMonths(displayMonth, -previousStep), normalizedStartMonth) >= 0,
);
const canGoNext = $derived(
  !latestDisplayMonth ||
    compareCalendarDays(addCalendarMonths(displayMonth, previousStep), latestDisplayMonth) <= 0,
);

function selectedAnchor(value: CalendarSelection): Date | undefined {
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value[0];
  return value?.from;
}

function setMonth(next: Date): void {
  let value = startOfCalendarMonth(next);
  if (normalizedStartMonth && compareCalendarDays(value, normalizedStartMonth) < 0) {
    value = normalizedStartMonth;
  }
  if (latestDisplayMonth && compareCalendarDays(value, latestDisplayMonth) > 0) {
    value = latestDisplayMonth;
  }
  uncontrolledMonth = value;
  month = value;
  onMonthChange?.(value);
}

function isOutsideAllowed(dateValue: Date): boolean {
  if (minDate && compareCalendarDays(dateValue, minDate) < 0) return false;
  if (maxDate && compareCalendarDays(dateValue, maxDate) > 0) return false;
  return true;
}

function dateState(dateValue: Date, modelMonth: Date, outside: boolean): CalendarDayContext {
  const unavailableDate = isDateMatched(dateValue, unavailable);
  const disabledDate =
    !isOutsideAllowed(dateValue) || isDateMatched(dateValue, disabled) || unavailableDate;
  const range = getRangeFlags(dateValue, selected);
  return {
    date: dateValue,
    displayMonth: modelMonth,
    outside,
    selected: isSelectedDate(mode, dateValue, selected),
    disabled: disabledDate,
    unavailable: unavailableDate,
    today: isSameCalendarDay(dateValue, today),
    ...range,
  };
}

function selectionContainsDisabled(range: DateRange): boolean {
  if (!range.from || !range.to) return false;
  const rangeStart = range.from;
  const span = Math.abs(differenceInCalendarDays(range.to, rangeStart));
  return Array.from({ length: span + 1 }, (_, index) => addCalendarDays(rangeStart, index)).some(
    (dateValue) =>
      !isOutsideAllowed(dateValue) ||
      isDateMatched(dateValue, disabled) ||
      isDateMatched(dateValue, unavailable),
  );
}

function selectDate(dateValue: Date, event: MouseEvent): void {
  const state = dateState(dateValue, startOfCalendarMonth(dateValue), false);
  if (state.disabled) return;
  const selectionOptions = {
    ...(min === undefined ? {} : { min }),
    ...(max === undefined ? {} : { max }),
    required,
  };
  let next = resolveSelection(mode, dateValue, selected, selectionOptions);
  if (
    mode === "range" &&
    excludeDisabled &&
    next &&
    !(next instanceof Date) &&
    !Array.isArray(next) &&
    next.to &&
    selectionContainsDisabled(next)
  ) {
    next = { from: normalizeCalendarDate(dateValue) };
  }
  selected = next;
  focusedDate = normalizeCalendarDate(dateValue);
  onDayClick?.(normalizeCalendarDate(dateValue), event);
  onSelect?.(next);
}

function customModifierNames(dateValue: Date): string[] {
  return Object.entries(modifiers)
    .filter(([, matcher]) => isDateMatched(dateValue, matcher))
    .map(([name]) => name);
}

function caption(monthValue: Date): string {
  return (
    formatters.formatCaption?.(monthValue, formatterOptions) ??
    new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(monthValue)
  );
}

function monthDropdownLabel(monthValue: Date): string {
  return (
    formatters.formatMonthDropdown?.(monthValue, formatterOptions) ??
    new Intl.DateTimeFormat(locale, { month: "short" }).format(monthValue)
  );
}

function yearDropdownLabel(year: number): string {
  return formatters.formatYearDropdown?.(year, formatterOptions) ?? String(year);
}

function weekdayLabel(dateValue: Date): string {
  return (
    formatters.formatWeekdayName?.(dateValue, formatterOptions) ??
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(dateValue).slice(0, 2)
  );
}

function dayLabel(dateValue: Date): string {
  return formatters.formatDay?.(dateValue, formatterOptions) ?? String(dateValue.getDate());
}

function accessibleDayLabel(state: CalendarDayContext): string {
  const dateValue = state.date;
  let label: string;
  if (locale.toLowerCase().startsWith("en")) {
    const dayValue = dateValue.getDate();
    const remainder = dayValue % 100;
    const digit = dayValue % 10;
    let suffix = "th";
    if (remainder < 11 || remainder > 13) {
      if (digit === 1) suffix = "st";
      if (digit === 2) suffix = "nd";
      if (digit === 3) suffix = "rd";
    }
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(dateValue);
    const monthName = new Intl.DateTimeFormat(locale, { month: "long" }).format(dateValue);
    label = `${weekday}, ${monthName} ${dayValue}${suffix}, ${dateValue.getFullYear()}`;
  } else {
    label = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      weekday: "long",
      year: "numeric",
    }).format(dateValue);
  }
  if (state.today) label = `Today, ${label}`;
  if (state.selected) label = `${label}, selected`;
  if (state.unavailable) label = `${label}, unavailable`;
  return label;
}

function monthOptions(): CalendarDropdownContext["options"] {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const dateValue = new Date(displayMonth.getFullYear(), monthIndex, 1, 12);
    const beforeStart =
      normalizedStartMonth && compareCalendarDays(dateValue, normalizedStartMonth) < 0;
    const afterEnd = normalizedEndMonth && compareCalendarDays(dateValue, normalizedEndMonth) > 0;
    return {
      disabled: Boolean(beforeStart || afterEnd),
      label: monthDropdownLabel(dateValue),
      value: monthIndex,
    };
  });
}

function yearOptions(): CalendarDropdownContext["options"] {
  const first = normalizedStartMonth?.getFullYear() ?? displayMonth.getFullYear() - 100;
  const last = normalizedEndMonth?.getFullYear() ?? displayMonth.getFullYear() + 100;
  return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => {
    const year = first + index;
    return { label: yearDropdownLabel(year), value: year };
  });
}

function changeCaptionMonth(value: number, monthIndex: number): void {
  const next = new Date(displayMonth.getFullYear(), value - monthIndex, 1, 12);
  setMonth(next);
}

function changeCaptionYear(value: number, monthIndex: number): void {
  const next = new Date(value, displayMonth.getMonth() - monthIndex, 1, 12);
  setMonth(next);
}

function onNativeDropdownChange(event: Event, handler: (value: number) => void): void {
  handler(Number((event.currentTarget as HTMLSelectElement).value));
}

async function focusDay(dateValue: Date, searchDirection = 1): Promise<void> {
  let target = normalizeCalendarDate(dateValue);
  for (let attempts = 0; attempts < 366; attempts += 1) {
    if (!dateState(target, startOfCalendarMonth(target), false).disabled) break;
    target = addCalendarDays(target, searchDirection);
  }
  focusedDate = target;
  const visibleStart = displayMonth;
  const visibleEnd = addCalendarMonths(displayMonth, monthCount - 1);
  const targetMonth = startOfCalendarMonth(focusedDate);
  if (
    compareCalendarDays(targetMonth, visibleStart) < 0 ||
    compareCalendarDays(targetMonth, visibleEnd) > 0
  ) {
    setMonth(targetMonth);
  }
  await tick();
  ref
    ?.querySelector<HTMLElement>(`[data-calendar-date="${dateKey(focusedDate)}"]`)
    ?.focus({ preventScroll: true });
}

function dateKey(dateValue: Date): string {
  const year = String(dateValue.getFullYear()).padStart(4, "0");
  const monthValue = String(dateValue.getMonth() + 1).padStart(2, "0");
  const dayValue = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${monthValue}-${dayValue}`;
}

function handleDayKeydown(event: KeyboardEvent, dateValue: Date): void {
  let next: Date | undefined;
  let searchDirection = 1;
  const rtl = getComputedStyle(event.currentTarget as HTMLElement).direction === "rtl";
  if (event.key === "ArrowLeft") {
    searchDirection = rtl ? 1 : -1;
    next = addCalendarDays(dateValue, searchDirection);
  }
  if (event.key === "ArrowRight") {
    searchDirection = rtl ? -1 : 1;
    next = addCalendarDays(dateValue, searchDirection);
  }
  if (event.key === "ArrowUp") {
    searchDirection = -1;
    next = addCalendarDays(dateValue, -7);
  }
  if (event.key === "ArrowDown") next = addCalendarDays(dateValue, 7);
  if (event.key === "Home")
    next = addCalendarDays(dateValue, -((dateValue.getDay() - weekStartsOn + 7) % 7));
  if (event.key === "End") {
    searchDirection = -1;
    next = addCalendarDays(dateValue, 6 - ((dateValue.getDay() - weekStartsOn + 7) % 7));
  }
  if (event.key === "PageUp") {
    searchDirection = -1;
    next = addCalendarMonths(dateValue, event.shiftKey ? -12 : -1);
  }
  if (event.key === "PageDown") next = addCalendarMonths(dateValue, event.shiftKey ? 12 : 1);
  if (!next) return;
  event.preventDefault();
  void focusDay(next, searchDirection);
}

function isFocusTarget(dateValue: Date): boolean {
  if (isSameCalendarDay(dateValue, focusedDate)) return true;
  const selectedDate = selectedAnchor(selected);
  return !focusedDate && Boolean(selectedDate && isSameCalendarDay(dateValue, selectedDate));
}
</script>

<div
  bind:this={ref}
  class={cn(
    "w-fit [--cell-size:--spacing(10)] sm:[--cell-size:--spacing(9)]",
    className,
    legacyClassName,
  )}
  data-slot="calendar"
  {...props}
>
  <div class={resolvedClassNames.months} data-slot="calendar-months">
    {#if !hideNavigation}
      <nav aria-label="Calendar navigation" class={resolvedClassNames.nav} data-slot="calendar-nav">
        <button
          aria-label="Go to the Previous Month"
          class={resolvedClassNames.button_previous}
          disabled={!canGoPrevious}
          onclick={() => setMonth(addCalendarMonths(displayMonth, -previousStep))}
          type="button"
        >
          {#if components.Chevron}
            {@render components.Chevron({ orientation: "left" })}
          {:else}
            <HugeiconsIcon aria-hidden="true" icon={ArrowLeft01Icon} strokeWidth={2} />
          {/if}
        </button>
        <button
          aria-label="Go to the Next Month"
          class={resolvedClassNames.button_next}
          disabled={!canGoNext}
          onclick={() => setMonth(addCalendarMonths(displayMonth, previousStep))}
          type="button"
        >
          {#if components.Chevron}
            {@render components.Chevron({ orientation: "right" })}
          {:else}
            <HugeiconsIcon aria-hidden="true" icon={ArrowRight01Icon} strokeWidth={2} />
          {/if}
        </button>
      </nav>
    {/if}

    {#each displayedMonths as calendarMonth, monthIndex (dateKey(calendarMonth.value))}
      <section class={resolvedClassNames.month} data-slot="calendar-month">
        <header class={resolvedClassNames.month_caption} data-slot="month-caption">
          {#if captionLayout === "label"}
            <span
              class={resolvedClassNames.caption_label}
              id={`${dateKey(calendarMonth.value)}-caption`}
            >
              {caption(calendarMonth.value)}
            </span>
          {:else}
            {#snippet dropdownControls()}
              {#if captionLayout === "dropdown" || captionLayout === "dropdown-months"}
                {const dropdownContext: CalendarDropdownContext = {
                  "aria-label": "Choose the Month",
                  disabled: false,
                  kind: "month",
                  onChange: (value) => changeCaptionMonth(value, monthIndex),
                  options: monthOptions(),
                  value: calendarMonth.value.getMonth(),
                }}
                {#if components.Dropdown}
                  {@render components.Dropdown(dropdownContext)}
                {:else}
                  <span class={resolvedClassNames.dropdown_root}>
                    <select
                      aria-label={dropdownContext["aria-label"]}
                      class={resolvedClassNames.dropdown}
                      onchange={(event) => onNativeDropdownChange(event, dropdownContext.onChange)}
                      value={dropdownContext.value}
                    >
                      {#each dropdownContext.options as option (option.value)}
                        <option disabled={option.disabled} value={option.value}>
                          {option.label}
                        </option>
                      {/each}
                    </select>
                    <span aria-hidden="true" class={resolvedClassNames.caption_label}>
                      {dropdownContext.options.find((option) => option.value === dropdownContext.value)?.label}
                      {#if components.Chevron}
                        {@render components.Chevron({ orientation: "down" })}
                      {:else}
                        <HugeiconsIcon aria-hidden="true" icon={ArrowUpDownIcon} strokeWidth={2} />
                      {/if}
                    </span>
                  </span>
                {/if}
              {:else}
                <span class={resolvedClassNames.caption_label}
                  >{monthDropdownLabel(calendarMonth.value)}</span
                >
              {/if}

              {#if captionLayout === "dropdown" || captionLayout === "dropdown-years"}
                {const dropdownContext: CalendarDropdownContext = {
                  "aria-label": "Choose the Year",
                  disabled: false,
                  kind: "year",
                  onChange: (value) => changeCaptionYear(value, monthIndex),
                  options: yearOptions(),
                  value: calendarMonth.value.getFullYear(),
                }}
                {#if components.Dropdown}
                  {@render components.Dropdown(dropdownContext)}
                {:else}
                  <span class={resolvedClassNames.dropdown_root}>
                    <select
                      aria-label={dropdownContext["aria-label"]}
                      class={resolvedClassNames.dropdown}
                      onchange={(event) => onNativeDropdownChange(event, dropdownContext.onChange)}
                      value={dropdownContext.value}
                    >
                      {#each dropdownContext.options as option (option.value)}
                        <option disabled={option.disabled} value={option.value}>
                          {option.label}
                        </option>
                      {/each}
                    </select>
                    <span aria-hidden="true" class={resolvedClassNames.caption_label}>
                      {dropdownContext.value}
                      {#if components.Chevron}
                        {@render components.Chevron({ orientation: "down" })}
                      {:else}
                        <HugeiconsIcon aria-hidden="true" icon={ArrowUpDownIcon} strokeWidth={2} />
                      {/if}
                    </span>
                  </span>
                {/if}
              {:else}
                <span class={resolvedClassNames.caption_label}
                  >{calendarMonth.value.getFullYear()}</span
                >
              {/if}
            {/snippet}
            {#if components.DropdownNav}
              {@render components.DropdownNav({
                children: dropdownControls,
                class: resolvedClassNames.dropdowns,
              })}
            {:else}
              <div class={resolvedClassNames.dropdowns}>
                {@render dropdownControls()}
              </div>
            {/if}
          {/if}
        </header>

        <table
          aria-label={caption(calendarMonth.value)}
          aria-multiselectable={mode !== "single"}
          data-slot="calendar-grid"
          role="grid"
        >
          <thead>
            <tr>
              {#if showWeekNumber}
                <th aria-label="Week number" class={resolvedClassNames.week_number} scope="col">
                  #
                </th>
              {/if}
              {#each weekdayDates as weekday (weekday.getDay())}
                <th class={resolvedClassNames.weekday} scope="col">{weekdayLabel(weekday)}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each calendarMonth.weeks as weekDates (dateKey(weekDates[0]?.date ?? calendarMonth.value))}
              <tr>
                {#if showWeekNumber}
                  <th class={resolvedClassNames.week_number} data-slot="week-number" scope="row">
                    {const weekContext = {
                      dates: weekDates.map((entry) => entry.date),
                      weekNumber: getIsoWeekNumber(weekDates[0]?.date ?? calendarMonth.value),
                    }}
                    {#if weekNumber}
                      {@render weekNumber(weekContext)}
                    {:else if components.WeekNumber}
                      {@render components.WeekNumber(weekContext)}
                    {:else}
                      {weekContext.weekNumber}
                    {/if}
                  </th>
                {/if}
                {#each weekDates as calendarDay (dateKey(calendarDay.date))}
                  {const state = $derived(
                    dateState(calendarDay.date, calendarMonth.value, calendarDay.outside),
                  )}
                  {const modifierNames = $derived(customModifierNames(calendarDay.date))}
                  {const dayClass = $derived(
                    cn(
                      resolvedClassNames.day,
                      state.outside && resolvedClassNames.outside,
                      state.today && resolvedClassNames.today,
                      state.rangeStart && resolvedClassNames.range_start,
                      state.rangeMiddle && resolvedClassNames.range_middle,
                      state.rangeEnd && resolvedClassNames.range_end,
                      modifierNames.map((name) => resolvedClassNames[name]),
                    ),
                  )}
                  <td
                    aria-selected={state.selected ? "true" : undefined}
                    class={dayClass}
                    data-day={dateKey(calendarDay.date)}
                    data-disabled={state.disabled ? "true" : undefined}
                    data-month={dateKey(calendarMonth.value).slice(0, 7)}
                    data-outside={state.outside ? "true" : undefined}
                    data-selected={state.selected ? "true" : undefined}
                    data-today={state.today ? "true" : undefined}
                    data-unavailable={state.unavailable ? "true" : undefined}
                    role="gridcell"
                    tabindex="-1"
                  >
                    {#if state.outside && !showOutsideDays}
                      <span
                        aria-hidden="true"
                        class={cn(resolvedClassNames.hidden, resolvedClassNames.day_button)}
                      >
                        {dayLabel(calendarDay.date)}
                      </span>
                    {:else}
                      <button
                        aria-label={accessibleDayLabel(state)}
                        class={resolvedClassNames.day_button}
                        data-calendar-date={dateKey(calendarDay.date)}
                        disabled={state.disabled}
                        onclick={(event) => selectDate(calendarDay.date, event)}
                        onfocus={() => (focusedDate = normalizeCalendarDate(calendarDay.date))}
                        onkeydown={(event) => handleDayKeydown(event, calendarDay.date)}
                        tabindex={isFocusTarget(calendarDay.date) ? 0 : -1}
                        type="button"
                      >
                        {#if day}
                          {@render day(state)}
                        {:else if components.DayButton}
                          {@render components.DayButton(state)}
                        {:else}
                          {dayLabel(calendarDay.date)}
                        {/if}
                      </button>
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
    {/each}
  </div>
</div>
