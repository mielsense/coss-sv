<!-- biome-ignore-all lint/a11y/noNoninteractiveElementToInteractiveRole lint/a11y/useFocusableInteractive: COSS and the WAI-ARIA calendar grid pattern put focus on each gridcell's day button. -->
<script module lang="ts">
import type { CalendarClassNames } from "./calendar.types.js";

const buttonClassNames =
  "relative flex size-(--cell-size) text-base sm:text-sm items-center justify-center rounded-lg text-foreground not-in-data-selected:hover:bg-accent disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";

export const calendarDefaultClassNames = {
  button_next: buttonClassNames,
  button_previous: buttonClassNames,
  caption_label: "text-base sm:text-sm font-medium flex items-center gap-2 h-full",
  chevron: "rdp-chevron",
  day: "size-(--cell-size) text-sm py-px",
  day_button: `${buttonClassNames} in-data-disabled:pointer-events-none in-[.range-middle]:rounded-none in-[.range-end:not(.range-start)]:rounded-s-none in-[.range-start:not(.range-end)]:rounded-e-none in-[.range-middle]:in-data-selected:bg-accent in-data-selected:bg-primary in-[.range-middle]:in-data-selected:text-foreground in-data-disabled:text-muted-foreground/72 in-data-outside:text-muted-foreground/72 in-data-selected:in-data-outside:text-primary-foreground in-data-selected:text-primary-foreground in-data-disabled:line-through outline-none in-[[data-selected]:not(.range-middle)]:transition-[border-radius,box-shadow] focus-visible:z-1 focus-visible:ring-[3px] focus-visible:ring-ring/50`,
  disabled: "rdp-disabled",
  dropdown: "absolute bg-popover inset-0 opacity-0",
  dropdown_root:
    "relative has-focus:border-ring has-focus:ring-ring/50 has-focus:ring-[3px] border border-input shadow-xs/5 rounded-lg px-[calc(--spacing(3)-1px)] h-9 sm:h-8 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-me-1",
  dropdowns:
    "w-full flex items-center text-base sm:text-sm justify-center h-(--cell-size) gap-1.5 *:[span]:font-medium",
  focused: "rdp-focused",
  hidden: "invisible",
  month: "w-full",
  month_caption:
    "relative mx-(--cell-size) px-1 mb-1 flex h-(--cell-size) items-center justify-center z-2",
  month_grid: "rdp-month_grid",
  months: "relative flex flex-col sm:flex-row gap-2",
  months_dropdown: "rdp-months_dropdown",
  nav: "absolute top-0 flex w-full justify-between z-1",
  outside: "text-muted-foreground data-selected:bg-accent/50 data-selected:text-muted-foreground",
  range_end: "range-end",
  range_middle: "range-middle",
  range_start: "range-start",
  root: "rdp-root",
  selected: "rdp-selected",
  today:
    "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-1 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30",
  week: "rdp-week",
  week_number: "size-(--cell-size) p-0 text-xs font-medium text-muted-foreground/72",
  week_number_header: "rdp-week_number_header",
  weekday: "size-(--cell-size) p-0 text-xs font-medium text-muted-foreground/72",
  weekdays: "rdp-weekdays",
  weeks: "rdp-weeks",
  years_dropdown: "rdp-years_dropdown",
} satisfies CalendarClassNames;
</script>

<script lang="ts">
import { ArrowLeft01Icon, ArrowRight01Icon, ArrowUpDownIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { tick, untrack } from "svelte";
import { cn } from "$lib/utils.js";
import type { CalendarDateOptions } from "./calendar.utils.js";
import type {
  CalendarDayButtonProps,
  CalendarDayContext,
  CalendarDayModel,
  CalendarDropdownContext,
  CalendarLocale,
  CalendarModifiers,
  CalendarProps,
  CalendarSelection,
  CalendarWeekModel,
  CalendarWeekNumberProps,
  DateRange,
} from "./calendar.types.js";
import {
  addCalendarDays,
  addCalendarMonths,
  buildCalendarMonth,
  compareCalendarDays,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  getCalendarWeekNumber,
  getRangeFlags,
  isDateMatched,
  isSameCalendarDay,
  isSelectedDate,
  normalizeCalendarDate,
  resolveCanonicalSelection,
  startOfCalendarMonth,
} from "./calendar.utils.js";

const defaultLocale: CalendarLocale = { code: "en-US", options: { weekStartsOn: 0 } };

let {
  autoFocus = false,
  captionLayout = "label",
  class: className,
  className: legacyClassName,
  classNames = {},
  components = {},
  day,
  defaultMonth,
  defaultSelected,
  disableNavigation = false,
  disabled,
  endMonth,
  excludeDisabled = false,
  fixedWeeks = false,
  formatters = {},
  hideNavigation = false,
  hideWeekdays = false,
  labels = {},
  lang: rootLang,
  locale = defaultLocale,
  max,
  maxDate,
  min,
  minDate,
  mode = "single",
  modifiers = {},
  month = $bindable(),
  noonSafe = false,
  numberOfMonths = 1,
  onDayBlur,
  onDayClick,
  onDayFocus,
  onDayKeyDown,
  onDayMouseEnter,
  onDayMouseLeave,
  onMonthChange,
  onNextClick,
  onPrevClick,
  onSelect,
  pagedNavigation = false,
  ref = $bindable(null),
  required = false,
  resetOnSelect = false,
  reverseMonths = false,
  reverseYears = false,
  selected = $bindable<CalendarSelection>(),
  showOutsideDays = true,
  showWeekNumber = false,
  startMonth,
  timeZone,
  today: todayProp,
  unavailable,
  weekNumber,
  weekStartsOn,
  ...props
}: CalendarProps = $props();

const { instanceNow, initialDateOptions, initialToday } = untrack(() => {
  const now = new Date();
  const options: CalendarDateOptions = { noonSafe, timeZone };
  return {
    initialDateOptions: options,
    initialToday: normalizeCalendarDate(todayProp ?? now, options),
    instanceNow: now,
  };
});
const initialSelected = untrack(() =>
  normalizeSelection(onSelect ? selected : (selected ?? defaultSelected), initialDateOptions),
);
const selectionControlled = $derived(onSelect !== undefined);
const initialMonth = untrack(() => {
  const anchor = month
    ? normalizeCalendarDate(month, initialDateOptions)
    : defaultMonth
      ? normalizeCalendarDate(defaultMonth, initialDateOptions)
      : (selectedAnchor(initialSelected) ?? initialToday);
  return startOfCalendarMonth(anchor, initialDateOptions);
});
let uncontrolledMonth = $state(initialMonth);
let uncontrolledSelection = $state.raw<CalendarSelection>(initialSelected);
let emittedMonth = $state.raw<Date | undefined>();
let emittedSelection = $state.raw<CalendarSelection>();
let hadExternalSelection = $state(untrack(() => selected !== undefined));
let focusedDate = $state<Date | undefined>(
  untrack(() => (autoFocus ? selectedAnchor(initialSelected) : undefined)),
);
let didAutoFocus = $state(false);

const dateOptions = $derived<CalendarDateOptions>({ noonSafe, timeZone });
const monthControlled = $derived(
  month !== undefined && month.getTime() !== emittedMonth?.getTime(),
);
const localeCode = $derived(locale.code ?? "en-US");
const effectiveWeekStartsOn = $derived(weekStartsOn ?? locale.options?.weekStartsOn ?? 0);
const currentToday = $derived(normalizeCalendarDate(todayProp ?? instanceNow, dateOptions));
const monthCount = $derived(Math.max(1, Math.floor(numberOfMonths)));
const normalizedStartMonth = $derived(
  startMonth
    ? startOfCalendarMonth(normalizeCalendarDate(startMonth, dateOptions), dateOptions)
    : undefined,
);
const normalizedEndMonth = $derived(
  endMonth
    ? startOfCalendarMonth(normalizeCalendarDate(endMonth, dateOptions), dateOptions)
    : undefined,
);
const latestDisplayMonth = $derived(
  normalizedEndMonth
    ? addCalendarMonths(normalizedEndMonth, -(monthCount - 1), dateOptions)
    : undefined,
);
const displayMonth = $derived.by(() => {
  const externalMonth =
    month && emittedMonth?.getTime() === month.getTime()
      ? emittedMonth
      : month
        ? normalizeCalendarDate(month, dateOptions)
        : undefined;
  let value = startOfCalendarMonth(
    monthControlled && externalMonth ? externalMonth : uncontrolledMonth,
    dateOptions,
  );
  if (normalizedStartMonth && compareCalendarDays(value, normalizedStartMonth) < 0) {
    value = normalizedStartMonth;
  }
  if (latestDisplayMonth && compareCalendarDays(value, latestDisplayMonth) > 0) {
    value = latestDisplayMonth;
  }
  return value;
});
const renderedSelection = $derived.by(() => {
  if (!selectionControlled) return uncontrolledSelection;
  return isSameSelectionValue(selected, emittedSelection)
    ? emittedSelection
    : normalizeSelection(selected, dateOptions);
});
const displayedMonths = $derived.by(() => {
  const values = Array.from({ length: monthCount }, (_, index) =>
    buildCalendarMonth(addCalendarMonths(displayMonth, index, dateOptions), {
      ...dateOptions,
      fixedWeeks,
      weekStartsOn: effectiveWeekStartsOn,
    }),
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
const formatterOptions = $derived({ locale, localeCode, timeZone });
const weekdayDates = $derived(
  Array.from({ length: 7 }, (_, index) =>
    addCalendarDays(new Date(2026, 0, 4), effectiveWeekStartsOn + index, dateOptions),
  ),
);
const previousStep = $derived(pagedNavigation ? monthCount : 1);
const previousMonth = $derived(addCalendarMonths(displayMonth, -previousStep, dateOptions));
const nextMonth = $derived(addCalendarMonths(displayMonth, previousStep, dateOptions));
const canGoPrevious = $derived(
  !disableNavigation &&
    (!normalizedStartMonth || compareCalendarDays(previousMonth, normalizedStartMonth) >= 0),
);
const canGoNext = $derived(
  !disableNavigation &&
    (!latestDisplayMonth || compareCalendarDays(nextMonth, latestDisplayMonth) <= 0),
);
const focusTargetDate = $derived.by(() => {
  const days = displayedMonths.flatMap((calendarMonth) =>
    calendarMonth.weeks.flatMap((week) =>
      week.map((entry) => ({ ...entry, displayMonth: calendarMonth.value })),
    ),
  );
  const focusable = days.filter(
    (entry) =>
      !entry.outside &&
      !dateState(entry.date, entry.displayMonth, false, renderedSelection, currentToday).disabled,
  );
  const candidates = [focusedDate, selectedAnchor(renderedSelection), currentToday];
  for (const candidate of candidates) {
    if (candidate && focusable.some((entry) => isSameCalendarDay(entry.date, candidate))) {
      return candidate;
    }
  }
  return focusable[0]?.date;
});

function normalizeSelection(
  value: CalendarSelection,
  options: CalendarDateOptions,
): CalendarSelection {
  if (value instanceof Date) return normalizeCalendarDate(value, options);
  if (Array.isArray(value)) return value.map((entry) => normalizeCalendarDate(entry, options));
  if (!value) return undefined;
  return {
    from: value.from ? normalizeCalendarDate(value.from, options) : undefined,
    ...(value.to ? { to: normalizeCalendarDate(value.to, options) } : {}),
  };
}

function selectedAnchor(value: CalendarSelection): Date | undefined {
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value[0];
  return value?.from;
}

function isSameSelectionValue(left: CalendarSelection, right: CalendarSelection): boolean {
  if (left === undefined || right === undefined) return left === right;
  if (left instanceof Date || right instanceof Date) {
    return left instanceof Date && right instanceof Date && left.getTime() === right.getTime();
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => value.getTime() === right[index]?.getTime())
    );
  }
  return (
    left.from?.getTime() === right.from?.getTime() && left.to?.getTime() === right.to?.getTime()
  );
}

function setMonth(next: Date): void {
  if (disableNavigation) return;
  const isControlled = monthControlled;
  let value = startOfCalendarMonth(next, dateOptions);
  if (normalizedStartMonth && compareCalendarDays(value, normalizedStartMonth) < 0) {
    value = normalizedStartMonth;
  }
  if (latestDisplayMonth && compareCalendarDays(value, latestDisplayMonth) > 0) {
    value = latestDisplayMonth;
  }
  emittedMonth = value;
  uncontrolledMonth = value;
  if (!isControlled) {
    month = value;
  }
  onMonthChange?.(value);
}

function goPrevious(): void {
  if (!canGoPrevious) return;
  setMonth(previousMonth);
  onPrevClick?.(previousMonth);
}

function goNext(): void {
  if (!canGoNext) return;
  setMonth(nextMonth);
  onNextClick?.(nextMonth);
}

function isOutsideAllowed(dateValue: Date): boolean {
  if (minDate && compareCalendarDays(dateValue, normalizeCalendarDate(minDate, dateOptions)) < 0) {
    return false;
  }
  if (maxDate && compareCalendarDays(dateValue, normalizeCalendarDate(maxDate, dateOptions)) > 0) {
    return false;
  }
  return true;
}

function customModifierNames(dateValue: Date): string[] {
  return Object.entries(modifiers)
    .filter(([, matcher]) => isDateMatched(dateValue, matcher, dateOptions))
    .map(([name]) => name);
}

function dateState(
  dateValue: Date,
  modelMonth: Date,
  outside: boolean,
  selectionValue: CalendarSelection,
  todayValue: Date,
): CalendarDayContext {
  const unavailableDate = isDateMatched(dateValue, unavailable, dateOptions);
  const disabledDate =
    !isOutsideAllowed(dateValue) ||
    isDateMatched(dateValue, disabled, dateOptions) ||
    unavailableDate;
  const range = getRangeFlags(dateValue, selectionValue);
  return {
    date: dateValue,
    displayMonth: modelMonth,
    outside,
    selected: isSelectedDate(mode, dateValue, selectionValue),
    disabled: disabledDate,
    unavailable: unavailableDate,
    today: isSameCalendarDay(dateValue, todayValue),
    ...range,
  };
}

function dayModifiers(
  state: CalendarDayContext,
  customNames: readonly string[],
): CalendarModifiers {
  const values: CalendarModifiers = {
    disabled: state.disabled,
    focused: Boolean(focusTargetDate && isSameCalendarDay(state.date, focusedDate)),
    outside: state.outside,
    range_end: state.rangeEnd,
    range_middle: state.rangeMiddle,
    range_start: state.rangeStart,
    selected: state.selected,
    today: state.today,
    unavailable: state.unavailable,
  };
  for (const name of customNames) values[name] = true;
  return values;
}

function selectionContainsDisabled(range: DateRange): boolean {
  if (!range.from || !range.to) return false;
  const span = Math.abs(differenceInCalendarDays(range.to, range.from));
  return Array.from({ length: span + 1 }, (_, index) =>
    addCalendarDays(range.from as Date, index, dateOptions),
  ).some(
    (dateValue) =>
      !isOutsideAllowed(dateValue) ||
      isDateMatched(dateValue, disabled, dateOptions) ||
      isDateMatched(dateValue, unavailable, dateOptions),
  );
}

function selectDate(dateValue: Date, state: CalendarDayContext, event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  if (state.disabled) return;
  const triggerDate = dateValue;
  const modifierValues = dayModifiers(state, customModifierNames(dateValue));
  const selectionOptions = {
    ...(min === undefined ? {} : { min }),
    ...(max === undefined ? {} : { max }),
    required,
    resetOnSelect,
  };
  let next = resolveCanonicalSelection(mode, triggerDate, renderedSelection, selectionOptions);
  if (
    mode === "range" &&
    excludeDisabled &&
    next &&
    !(next instanceof Date) &&
    !Array.isArray(next) &&
    next.to &&
    selectionContainsDisabled(next)
  ) {
    next = { from: triggerDate };
  }
  if (!selectionControlled) {
    uncontrolledSelection = next;
    selected = next;
  }
  emittedSelection = next;
  focusedDate = triggerDate;
  (
    onSelect as
      | ((
          value: CalendarSelection,
          trigger: Date,
          modifiers: CalendarModifiers,
          event: MouseEvent,
        ) => void)
      | undefined
  )?.(next, triggerDate, modifierValues, event);
  onDayClick?.(triggerDate, modifierValues, event);
}

function caption(monthValue: Date): string {
  return (
    formatters.formatCaption?.(monthValue, formatterOptions) ??
    new Intl.DateTimeFormat(localeCode, { month: "long", year: "numeric" }).format(monthValue)
  );
}

function monthDropdownLabel(monthValue: Date): string {
  return (
    formatters.formatMonthDropdown?.(monthValue, formatterOptions) ??
    new Intl.DateTimeFormat(localeCode, { month: "short" }).format(monthValue)
  );
}

function yearDropdownLabel(year: number): string {
  return formatters.formatYearDropdown?.(year, formatterOptions) ?? String(year);
}

function weekdayLabel(dateValue: Date): string {
  return (
    formatters.formatWeekdayName?.(dateValue, formatterOptions) ??
    new Intl.DateTimeFormat(localeCode, { weekday: "short" }).format(dateValue).slice(0, 2)
  );
}

function fullWeekdayLabel(dateValue: Date): string {
  return new Intl.DateTimeFormat(localeCode, { weekday: "long" }).format(dateValue);
}

function dayLabel(dateValue: Date): string {
  return formatters.formatDay?.(dateValue, formatterOptions) ?? String(dateValue.getDate());
}

function accessibleDayLabel(state: CalendarDayContext, modifierValues: CalendarModifiers): string {
  const custom = labels.labelDayButton?.(state.date, modifierValues);
  if (custom) return custom;
  const dateValue = state.date;
  let label: string;
  if (localeCode.toLowerCase().startsWith("en")) {
    const dayValue = dateValue.getDate();
    const remainder = dayValue % 100;
    const digit = dayValue % 10;
    let suffix = "th";
    if (remainder < 11 || remainder > 13) {
      if (digit === 1) suffix = "st";
      if (digit === 2) suffix = "nd";
      if (digit === 3) suffix = "rd";
    }
    const weekday = fullWeekdayLabel(dateValue);
    const monthName = new Intl.DateTimeFormat(localeCode, { month: "long" }).format(dateValue);
    label = `${weekday}, ${monthName} ${dayValue}${suffix}, ${dateValue.getFullYear()}`;
  } else {
    label = new Intl.DateTimeFormat(localeCode, {
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

function monthOptions(monthValue: Date): CalendarDropdownContext["options"] {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const dateValue = new Date(monthValue.getFullYear(), monthIndex, 1);
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
  const values = Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => {
    const year = first + index;
    return { label: yearDropdownLabel(year), value: year };
  });
  return reverseYears ? values.reverse() : values;
}

function changeCaptionMonth(value: number, captionMonth: Date): void {
  const monthOffset = differenceInCalendarMonths(captionMonth, displayMonth);
  const changedCaption = new Date(captionMonth.getFullYear(), value, 1);
  setMonth(addCalendarMonths(changedCaption, -monthOffset, dateOptions));
}

function changeCaptionYear(value: number, captionMonth: Date): void {
  const monthOffset = differenceInCalendarMonths(captionMonth, displayMonth);
  const changedCaption = new Date(value, captionMonth.getMonth(), 1);
  setMonth(addCalendarMonths(changedCaption, -monthOffset, dateOptions));
}

function onNativeDropdownChange(event: Event, handler: (value: number) => void): void {
  handler(Number((event.currentTarget as HTMLSelectElement).value));
}

function isWithinNavigation(dateValue: Date): boolean {
  const monthValue = startOfCalendarMonth(dateValue, dateOptions);
  if (normalizedStartMonth && compareCalendarDays(monthValue, normalizedStartMonth) < 0)
    return false;
  if (normalizedEndMonth && compareCalendarDays(monthValue, normalizedEndMonth) > 0) return false;
  if (disableNavigation) {
    const end = addCalendarMonths(displayMonth, monthCount - 1, dateOptions);
    return (
      compareCalendarDays(monthValue, displayMonth) >= 0 &&
      compareCalendarDays(monthValue, end) <= 0
    );
  }
  return true;
}

type FocusStep = "day" | "month" | "week" | "year";

async function focusDay(
  dateValue: Date,
  searchDirection = 1,
  searchStep: FocusStep = "day",
): Promise<void> {
  let target = dateValue;
  let found: Date | undefined;
  for (let attempts = 0; attempts <= 365; attempts += 1) {
    if (!isWithinNavigation(target)) break;
    if (
      !dateState(
        target,
        startOfCalendarMonth(target, dateOptions),
        false,
        renderedSelection,
        currentToday,
      ).disabled
    ) {
      found = target;
      break;
    }
    if (searchStep === "week") {
      target = addCalendarDays(target, searchDirection * 7, dateOptions);
    } else if (searchStep === "month") {
      target = addCalendarMonths(target, searchDirection, dateOptions);
    } else if (searchStep === "year") {
      target = addCalendarMonths(target, searchDirection * 12, dateOptions);
    } else {
      target = addCalendarDays(target, searchDirection, dateOptions);
    }
  }
  if (!found) return;
  focusedDate = found;
  const visibleEnd = addCalendarMonths(displayMonth, monthCount - 1, dateOptions);
  const targetMonth = startOfCalendarMonth(found, dateOptions);
  if (
    compareCalendarDays(targetMonth, displayMonth) < 0 ||
    compareCalendarDays(targetMonth, visibleEnd) > 0
  ) {
    setMonth(targetMonth);
  }
  await tick();
  ref
    ?.querySelector<HTMLElement>(`[data-calendar-date="${dateKey(found)}"]`)
    ?.focus({ preventScroll: true });
}

function dateKey(dateValue: Date): string {
  const year = String(dateValue.getFullYear()).padStart(4, "0");
  const monthValue = String(dateValue.getMonth() + 1).padStart(2, "0");
  const dayValue = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${monthValue}-${dayValue}`;
}

function handleDayKeydown(
  event: KeyboardEvent,
  dateValue: Date,
  modifierValues: CalendarModifiers,
): void {
  let next: Date | undefined;
  let searchDirection = 1;
  let searchStep: FocusStep = "day";
  const rtl =
    (props.dir ?? getComputedStyle(event.currentTarget as HTMLElement).direction) === "rtl";
  if (event.key === "ArrowLeft") {
    searchDirection = rtl ? 1 : -1;
    next = event.shiftKey
      ? addCalendarMonths(dateValue, searchDirection, dateOptions)
      : addCalendarDays(dateValue, searchDirection, dateOptions);
    if (event.shiftKey) searchStep = "month";
  }
  if (event.key === "ArrowRight") {
    searchDirection = rtl ? -1 : 1;
    next = event.shiftKey
      ? addCalendarMonths(dateValue, searchDirection, dateOptions)
      : addCalendarDays(dateValue, searchDirection, dateOptions);
    if (event.shiftKey) searchStep = "month";
  }
  if (event.key === "ArrowUp") {
    searchDirection = -1;
    next = event.shiftKey
      ? addCalendarMonths(dateValue, -12, dateOptions)
      : addCalendarDays(dateValue, -7, dateOptions);
    searchStep = event.shiftKey ? "year" : "week";
  }
  if (event.key === "ArrowDown") {
    next = event.shiftKey
      ? addCalendarMonths(dateValue, 12, dateOptions)
      : addCalendarDays(dateValue, 7, dateOptions);
    searchStep = event.shiftKey ? "year" : "week";
  }
  if (event.key === "Home") {
    searchDirection = -1;
    next = addCalendarDays(
      dateValue,
      -((dateValue.getDay() - effectiveWeekStartsOn + 7) % 7),
      dateOptions,
    );
    searchStep = "week";
  }
  if (event.key === "End") {
    next = addCalendarDays(
      dateValue,
      6 - ((dateValue.getDay() - effectiveWeekStartsOn + 7) % 7),
      dateOptions,
    );
    searchStep = "week";
  }
  if (event.key === "PageUp") {
    searchDirection = -1;
    next = addCalendarMonths(dateValue, event.shiftKey ? -12 : -1, dateOptions);
    searchStep = event.shiftKey ? "year" : "month";
  }
  if (event.key === "PageDown") {
    next = addCalendarMonths(dateValue, event.shiftKey ? 12 : 1, dateOptions);
    searchStep = event.shiftKey ? "year" : "month";
  }
  if (next) {
    event.preventDefault();
    void focusDay(next, searchDirection, searchStep);
  }
  onDayKeyDown?.(dateValue, modifierValues, event);
}

function isFocusTarget(dateValue: Date, outside = false): boolean {
  return !outside && Boolean(focusTargetDate && isSameCalendarDay(dateValue, focusTargetDate));
}

$effect(() => {
  if (selectionControlled) return;
  if (selected !== undefined) {
    hadExternalSelection = true;
    uncontrolledSelection = isSameSelectionValue(selected, emittedSelection)
      ? emittedSelection
      : normalizeSelection(selected, dateOptions);
  } else if (hadExternalSelection) {
    uncontrolledSelection = undefined;
  }
});

$effect(() => {
  if (!autoFocus || didAutoFocus || !focusTargetDate) return;
  didAutoFocus = true;
  void focusDay(focusTargetDate);
});
</script>

<div
  bind:this={ref}
  class={cn(
    resolvedClassNames.root,
    "w-fit [--cell-size:--spacing(10)] sm:[--cell-size:--spacing(9)]",
    className,
    legacyClassName,
  )}
  data-mode={mode}
  data-multiple-months={monthCount > 1 || undefined}
  data-required={required || undefined}
  data-slot="calendar"
  data-week-numbers={showWeekNumber || undefined}
  lang={rootLang ?? localeCode}
  {...props}
>
  <div class={resolvedClassNames.months} data-slot="calendar-months">
    {#if !hideNavigation}
      <nav class={resolvedClassNames.nav} data-slot="calendar-nav">
        <button
          aria-disabled={!canGoPrevious || undefined}
          aria-label={labels.labelPrevious?.(canGoPrevious ? previousMonth : undefined) ?? "Go to the Previous Month"}
          class={resolvedClassNames.button_previous}
          onclick={goPrevious}
          tabindex={canGoPrevious ? undefined : -1}
          type="button"
        >
          {#if components.Chevron}
            {@render components.Chevron({ class: resolvedClassNames.chevron ?? "", orientation: "left" })}
          {:else}
            <HugeiconsIcon
              aria-hidden="true"
              class={resolvedClassNames.chevron ?? ""}
              icon={ArrowLeft01Icon}
              strokeWidth={2}
            />
          {/if}
        </button>
        <button
          aria-disabled={!canGoNext || undefined}
          aria-label={labels.labelNext?.(canGoNext ? nextMonth : undefined) ?? "Go to the Next Month"}
          class={resolvedClassNames.button_next}
          onclick={goNext}
          tabindex={canGoNext ? undefined : -1}
          type="button"
        >
          {#if components.Chevron}
            {@render components.Chevron({ class: resolvedClassNames.chevron ?? "", orientation: "right" })}
          {:else}
            <HugeiconsIcon
              aria-hidden="true"
              class={resolvedClassNames.chevron ?? ""}
              icon={ArrowRight01Icon}
              strokeWidth={2}
            />
          {/if}
        </button>
      </nav>
    {/if}

    {#each displayedMonths as calendarMonth (dateKey(calendarMonth.value))}
      <section class={resolvedClassNames.month} data-slot="calendar-month">
        <header class={resolvedClassNames.month_caption} data-slot="month-caption">
          {#if captionLayout === "label"}
            <span class={resolvedClassNames.caption_label} role="status" aria-live="polite">
              {caption(calendarMonth.value)}
            </span>
          {:else}
            {#snippet dropdownControls()}
              {#if captionLayout === "dropdown" || captionLayout === "dropdown-months"}
                {const dropdownContext: CalendarDropdownContext = {
                  "aria-label":
                    labels.labelMonthDropdown?.(calendarMonth.value) ?? "Choose the Month",
                  disabled: disableNavigation,
                  kind: "month",
                  onChange: (value) => changeCaptionMonth(value, calendarMonth.value),
                  options: monthOptions(calendarMonth.value),
                  value: calendarMonth.value.getMonth(),
                }}
                {#if components.Dropdown}
                  {@render components.Dropdown(dropdownContext)}
                {:else}
                  <span
                    class={cn(resolvedClassNames.dropdown_root, resolvedClassNames.months_dropdown)}
                  >
                    <select
                      aria-label={dropdownContext["aria-label"]}
                      class={resolvedClassNames.dropdown}
                      disabled={dropdownContext.disabled}
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
                        {@render components.Chevron({ class: resolvedClassNames.chevron ?? "", orientation: "down" })}
                      {:else}
                        <HugeiconsIcon
                          aria-hidden="true"
                          class={resolvedClassNames.chevron ?? ""}
                          icon={ArrowUpDownIcon}
                          strokeWidth={2}
                        />
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
                  "aria-label":
                    labels.labelYearDropdown?.(calendarMonth.value.getFullYear()) ??
                    "Choose the Year",
                  disabled: disableNavigation,
                  kind: "year",
                  onChange: (value) => changeCaptionYear(value, calendarMonth.value),
                  options: yearOptions(),
                  value: calendarMonth.value.getFullYear(),
                }}
                {#if components.Dropdown}
                  {@render components.Dropdown(dropdownContext)}
                {:else}
                  <span
                    class={cn(resolvedClassNames.dropdown_root, resolvedClassNames.years_dropdown)}
                  >
                    <select
                      aria-label={dropdownContext["aria-label"]}
                      class={resolvedClassNames.dropdown}
                      disabled={dropdownContext.disabled}
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
                        {@render components.Chevron({ class: resolvedClassNames.chevron ?? "", orientation: "down" })}
                      {:else}
                        <HugeiconsIcon
                          aria-hidden="true"
                          class={resolvedClassNames.chevron ?? ""}
                          icon={ArrowUpDownIcon}
                          strokeWidth={2}
                        />
                      {/if}
                    </span>
                  </span>
                {/if}
              {:else}
                <span class={resolvedClassNames.caption_label}
                  >{calendarMonth.value.getFullYear()}</span
                >
              {/if}
              <span class="sr-only" role="status" aria-live="polite"
                >{caption(calendarMonth.value)}</span
              >
            {/snippet}
            {#if components.DropdownNav}
              {@render components.DropdownNav({ children: dropdownControls, class: resolvedClassNames.dropdowns })}
            {:else}
              <div class={resolvedClassNames.dropdowns}>{@render dropdownControls()}</div>
            {/if}
          {/if}
        </header>

        <table
          aria-label={caption(calendarMonth.value)}
          aria-multiselectable={mode === "multiple" || mode === "range" ? "true" : undefined}
          class={resolvedClassNames.month_grid}
          data-slot="calendar-grid"
          role="grid"
        >
          {#if !hideWeekdays}
            <thead aria-hidden="true">
              <tr class={resolvedClassNames.weekdays}>
                {#if showWeekNumber}
                  <th
                    aria-label={labels.labelWeekNumberHeader?.() ?? "Week Number"}
                    class={resolvedClassNames.week_number_header}
                    scope="col"
                  >
                    #
                  </th>
                {/if}
                {#each weekdayDates as weekday (weekday.getDay())}
                  <th
                    aria-label={fullWeekdayLabel(weekday)}
                    class={resolvedClassNames.weekday}
                    scope="col"
                  >
                    {weekdayLabel(weekday)}
                  </th>
                {/each}
              </tr>
            </thead>
          {/if}
          <tbody class={resolvedClassNames.weeks}>
            {#each calendarMonth.weeks as weekDates (dateKey(weekDates[0]?.date ?? calendarMonth.value))}
              <tr class={resolvedClassNames.week}>
                {#if showWeekNumber}
                  {const weekValue = getCalendarWeekNumber(
                    weekDates[0]?.date ?? calendarMonth.value,
                    {
                      ...(locale.options?.firstWeekContainsDate
                        ? { firstWeekContainsDate: locale.options.firstWeekContainsDate }
                        : {}),
                      weekStartsOn: effectiveWeekStartsOn,
                    },
                  )}
                  {const weekModel: CalendarWeekModel = {
                    days: weekDates.map((entry) => ({
                      date: entry.date,
                      displayMonth: calendarMonth.value,
                      outside: entry.outside,
                    })),
                    weekNumber: weekValue,
                  }}
                  {#snippet weekNumberChildren()}
                    {weekValue}
                  {/snippet}
                  {const weekNumberAttributes = {
                    "aria-label": labels.labelWeekNumber?.(weekValue) ?? `Week ${weekValue}`,
                    class: resolvedClassNames.week_number,
                    "data-slot": "week-number",
                    role: "rowheader" as const,
                    scope: "row" as const,
                  }}
                  {const weekNumberProps: CalendarWeekNumberProps = {
                    ...weekNumberAttributes,
                    children: weekNumberChildren,
                    week: weekModel,
                  }}
                  {#if components.WeekNumber}
                    {@render components.WeekNumber(weekNumberProps)}
                  {:else}
                    <th {...weekNumberAttributes}>
                      {#if weekNumber}
                        {@render weekNumber({ dates: weekDates.map((entry) => entry.date), weekNumber: weekValue })}
                      {:else}
                        {@render weekNumberChildren()}
                      {/if}
                    </th>
                  {/if}
                {/if}
                {#each weekDates as calendarDay (dateKey(calendarDay.date))}
                  {const state = $derived(
                    dateState(
                      calendarDay.date,
                      calendarMonth.value,
                      calendarDay.outside,
                      renderedSelection,
                      currentToday,
                    ),
                  )}
                  {const modifierNames = $derived(customModifierNames(calendarDay.date))}
                  {const modifierValues = $derived(dayModifiers(state, modifierNames))}
                  {const dayClass = $derived(
                    cn(
                      resolvedClassNames.day,
                      state.disabled && resolvedClassNames.disabled,
                      modifierValues.focused && resolvedClassNames.focused,
                      state.outside && resolvedClassNames.outside,
                      state.selected && resolvedClassNames.selected,
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
                    data-focused={modifierValues.focused ? "true" : undefined}
                    data-month={state.outside ? dateKey(startOfCalendarMonth(calendarDay.date, dateOptions)).slice(0, 7) : undefined}
                    data-outside={state.outside ? "true" : undefined}
                    data-selected={state.selected ? "true" : undefined}
                    data-today={state.today ? "true" : undefined}
                    data-unavailable={state.unavailable ? "true" : undefined}
                    role="gridcell"
                  >
                    {#if state.outside && !showOutsideDays}
                      <span
                        aria-hidden="true"
                        class={cn(resolvedClassNames.hidden, resolvedClassNames.day_button)}
                      >
                        {dayLabel(calendarDay.date)}
                      </span>
                    {:else}
                      {#snippet dayButtonChildren()}
                        {#if day}
                          {@render day(state)}
                        {:else}
                          {dayLabel(calendarDay.date)}
                        {/if}
                      {/snippet}
                      {const dayModel: CalendarDayModel = {
                        date: calendarDay.date,
                        displayMonth: calendarMonth.value,
                        outside: calendarDay.outside,
                      }}
                      {const buttonAttributes = $derived({
                        "aria-disabled":
                          state.disabled && isFocusTarget(calendarDay.date, state.outside)
                            ? true
                            : undefined,
                        "aria-label": accessibleDayLabel(state, modifierValues),
                        class: resolvedClassNames.day_button,
                        "data-calendar-date": dateKey(calendarDay.date),
                        disabled: state.disabled && !isFocusTarget(calendarDay.date, state.outside),
                        onblur: (event: FocusEvent) => {
                          onDayBlur?.(calendarDay.date, modifierValues, event);
                          focusedDate = undefined;
                        },
                        onclick: (event: MouseEvent) => selectDate(calendarDay.date, state, event),
                        onfocus: (event: FocusEvent) => {
                          focusedDate = calendarDay.date;
                          onDayFocus?.(calendarDay.date, modifierValues, event);
                        },
                        onkeydown: (event: KeyboardEvent) =>
                          handleDayKeydown(event, calendarDay.date, modifierValues),
                        onmouseenter: (event: MouseEvent) =>
                          onDayMouseEnter?.(calendarDay.date, modifierValues, event),
                        onmouseleave: (event: MouseEvent) =>
                          onDayMouseLeave?.(calendarDay.date, modifierValues, event),
                        tabindex: isFocusTarget(calendarDay.date, state.outside) ? 0 : -1,
                        type: "button" as const,
                      })}
                      {const buttonProps: CalendarDayButtonProps = $derived({
                        ...buttonAttributes,
                        children: dayButtonChildren,
                        day: dayModel,
                        modifiers: modifierValues,
                      })}
                      {#if components.DayButton}
                        {@render components.DayButton(buttonProps)}
                      {:else}
                        <button {...buttonAttributes} type="button">
                          {@render dayButtonChildren()}
                        </button>
                      {/if}
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
