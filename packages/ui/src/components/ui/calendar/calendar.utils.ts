import type { CalendarMode, CalendarSelection, DateMatcher, DateRange } from "./calendar.types.js";

const DAY_MS = 86_400_000;

export interface CalendarDateOptions {
  noonSafe?: boolean;
  timeZone?: string | undefined;
}

function zonedDateParts(
  date: Date,
  timeZone: string,
): { day: number; month: number; year: number } {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-gregory-nu-latn", {
    day: "numeric",
    month: "numeric",
    timeZone,
    year: "numeric",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { day: value("day"), month: value("month") - 1, year: value("year") };
}

export function createCalendarDate(
  year: number,
  month: number,
  day: number,
  options: CalendarDateOptions = {},
): Date {
  return new Date(year, month, day, options.noonSafe && options.timeZone ? 12 : 0);
}

export function normalizeCalendarDate(date: Date, options: CalendarDateOptions = {}): Date {
  const parts = options.timeZone
    ? zonedDateParts(date, options.timeZone)
    : { day: date.getDate(), month: date.getMonth(), year: date.getFullYear() };
  return createCalendarDate(parts.year, parts.month, parts.day, options);
}

export function startOfCalendarMonth(date: Date, options: CalendarDateOptions = {}): Date {
  return createCalendarDate(date.getFullYear(), date.getMonth(), 1, options);
}

export function addCalendarDays(
  date: Date,
  amount: number,
  options: CalendarDateOptions = {},
): Date {
  const next = createCalendarDate(date.getFullYear(), date.getMonth(), date.getDate(), options);
  next.setDate(next.getDate() + amount);
  return createCalendarDate(next.getFullYear(), next.getMonth(), next.getDate(), options);
}

export function addCalendarMonths(
  date: Date,
  amount: number,
  options: CalendarDateOptions = {},
): Date {
  const firstOfTarget = createCalendarDate(
    date.getFullYear(),
    date.getMonth() + amount,
    1,
    options,
  );
  const lastOfTarget = createCalendarDate(
    firstOfTarget.getFullYear(),
    firstOfTarget.getMonth() + 1,
    0,
    options,
  );
  return createCalendarDate(
    firstOfTarget.getFullYear(),
    firstOfTarget.getMonth(),
    Math.min(date.getDate(), lastOfTarget.getDate()),
    options,
  );
}

export function differenceInCalendarMonths(left: Date, right: Date): number {
  return left.getFullYear() * 12 + left.getMonth() - (right.getFullYear() * 12 + right.getMonth());
}

export function isSameCalendarDay(left: Date | undefined, right: Date | undefined): boolean {
  return Boolean(
    left &&
      right &&
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate(),
  );
}

export function compareCalendarDays(left: Date, right: Date): number {
  return (
    Date.UTC(left.getFullYear(), left.getMonth(), left.getDate()) -
    Date.UTC(right.getFullYear(), right.getMonth(), right.getDate())
  );
}

export function differenceInCalendarDays(left: Date, right: Date): number {
  return Math.round(compareCalendarDays(left, right) / DAY_MS);
}

export function isDateMatched(
  date: Date,
  matcher: DateMatcher | DateMatcher[] | undefined,
  options: CalendarDateOptions = {},
): boolean {
  if (matcher === undefined || matcher === false) return false;
  if (matcher === true) return true;
  if (Array.isArray(matcher)) {
    if (matcher.length === 0) return false;
    if (matcher.every((entry) => entry instanceof Date)) {
      return matcher.some((entry) =>
        isSameCalendarDay(date, normalizeCalendarDate(entry as Date, options)),
      );
    }
    return matcher.some((entry) => isDateMatched(date, entry, options));
  }
  if (matcher instanceof Date)
    return isSameCalendarDay(date, normalizeCalendarDate(matcher, options));
  if (typeof matcher === "function") return matcher(date);
  if ("dayOfWeek" in matcher) {
    const days = Array.isArray(matcher.dayOfWeek) ? matcher.dayOfWeek : [matcher.dayOfWeek];
    return days.includes(date.getDay());
  }
  if ("from" in matcher) {
    if (matcher.from && !matcher.to) {
      return compareCalendarDays(date, normalizeCalendarDate(matcher.from, options)) >= 0;
    }
    if (!matcher.from && matcher.to) {
      return compareCalendarDays(date, normalizeCalendarDate(matcher.to, options)) <= 0;
    }
    if (!matcher.from || !matcher.to) return false;
    return (
      compareCalendarDays(date, normalizeCalendarDate(matcher.from, options)) >= 0 &&
      compareCalendarDays(date, normalizeCalendarDate(matcher.to, options)) <= 0
    );
  }
  if ("before" in matcher && "after" in matcher && matcher.before && matcher.after) {
    const after = normalizeCalendarDate(matcher.after, options);
    const before = normalizeCalendarDate(matcher.before, options);
    const isAfterBoundary = compareCalendarDays(date, after) > 0;
    const isBeforeBoundary = compareCalendarDays(date, before) < 0;
    return compareCalendarDays(before, after) > 0
      ? isAfterBoundary && isBeforeBoundary
      : isBeforeBoundary || isAfterBoundary;
  }
  if ("before" in matcher && matcher.before) {
    return compareCalendarDays(date, normalizeCalendarDate(matcher.before, options)) < 0;
  }
  if ("after" in matcher && matcher.after) {
    return compareCalendarDays(date, normalizeCalendarDate(matcher.after, options)) > 0;
  }
  return false;
}

export interface CalendarDayModelData {
  date: Date;
  outside: boolean;
}

export interface CalendarMonthModel {
  value: Date;
  weeks: Array<Array<CalendarDayModelData>>;
}

export function buildCalendarMonth(
  month: Date,
  options: CalendarDateOptions & {
    broadcastCalendar?: boolean;
    fixedWeeks?: boolean;
    weekStartsOn?: number;
  } = {},
): CalendarMonthModel {
  const value = startOfCalendarMonth(month, options);
  const weekStartsOn = (((options.weekStartsOn ?? 0) % 7) + 7) % 7;
  const firstOffset = (value.getDay() - weekStartsOn + 7) % 7;
  const firstDate = addCalendarDays(value, -firstOffset, options);
  const lastOfMonth = createCalendarDate(value.getFullYear(), value.getMonth() + 1, 0, options);
  const naturalCells = firstOffset + lastOfMonth.getDate();
  let cellCount = options.fixedWeeks ? 42 : Math.ceil(naturalCells / 7) * 7;
  if (options.broadcastCalendar) {
    const fifthWeekEnd = addCalendarDays(firstDate, 34, options);
    const broadcastWeeks = fifthWeekEnd.getMonth() === value.getMonth() ? 5 : 4;
    cellCount = options.fixedWeeks ? 35 : broadcastWeeks * 7;
  }
  const weeks: CalendarMonthModel["weeks"] = [];

  for (let offset = 0; offset < cellCount; offset += 7) {
    const week: CalendarMonthModel["weeks"][number] = [];
    for (let day = 0; day < 7; day += 1) {
      const date = addCalendarDays(firstDate, offset + day, options);
      week.push({ date, outside: date.getMonth() !== value.getMonth() });
    }
    weeks.push(week);
  }
  return { value, weeks };
}

function addToRange(
  date: Date,
  initialRange: DateRange | undefined,
  options: { max?: number; min?: number; required?: boolean },
): DateRange | undefined {
  const { from, to } = initialRange ?? {};
  const min = options.min ?? 0;
  const max = options.max ?? 0;
  let range: DateRange | undefined;

  if (!from && !to) range = min > 0 ? { from: date, to: undefined } : { from: date, to: date };
  else if (from && !to) {
    if (isSameCalendarDay(from, date)) {
      if (min === 0) range = { from, to: date };
      else range = options.required ? { from, to: undefined } : undefined;
    } else if (compareCalendarDays(date, from) < 0) range = { from: date, to: from };
    else range = { from, to: date };
  } else if (from && to) {
    if (isSameCalendarDay(from, date) && isSameCalendarDay(to, date)) {
      range = options.required ? { from, to } : undefined;
    } else if (isSameCalendarDay(from, date)) {
      range = min > 0 ? { from, to: undefined } : { from, to: date };
    } else if (isSameCalendarDay(to, date)) {
      range = min > 0 ? { from: date, to: undefined } : { from: date, to: date };
    } else if (compareCalendarDays(date, from) < 0) range = { from: date, to };
    else range = { from, to: date };
  }

  if (range?.from && range.to) {
    const diff = differenceInCalendarDays(range.to, range.from);
    if (max > 0 && diff > max) range = { from: date, to: undefined };
    else if (min > 1 && diff < min) range = { from: date, to: undefined };
  }
  return range;
}

export function resolveCanonicalSelection(
  mode: CalendarMode,
  date: Date,
  current: CalendarSelection,
  options: {
    max?: number;
    min?: number;
    required?: boolean;
    resetOnSelect?: boolean;
  } = {},
): CalendarSelection {
  const nextDate = date;
  if (mode === "single") {
    const selected = current instanceof Date ? current : undefined;
    if (isSameCalendarDay(selected, nextDate)) return options.required ? selected : undefined;
    return nextDate;
  }

  if (mode === "multiple") {
    const selected = Array.isArray(current) ? current : [];
    const index = selected.findIndex((entry) => isSameCalendarDay(entry, nextDate));
    if (index >= 0) {
      if (options.required && selected.length === 1) return selected;
      if (options.min !== undefined && selected.length === options.min) return selected;
      return selected.filter((_, itemIndex) => itemIndex !== index);
    }
    if (options.max !== undefined && selected.length === options.max) return [nextDate];
    return [...selected, nextDate];
  }

  const currentRange =
    current && !(current instanceof Date) && !Array.isArray(current) ? current : undefined;
  const range = currentRange;
  const isFullRange = Boolean(range?.from && range.to);
  const isClickingSingleDayRange = Boolean(
    range?.from &&
      range.to &&
      isSameCalendarDay(range.from, range.to) &&
      isSameCalendarDay(nextDate, range.from),
  );
  if (options.resetOnSelect && (isFullRange || !range?.from)) {
    if (!options.required && isClickingSingleDayRange) return undefined;
    return { from: nextDate, to: undefined };
  }
  return addToRange(nextDate, range, options);
}

export function resolveSelection(
  mode: CalendarMode,
  date: Date,
  current: CalendarSelection,
  options: {
    max?: number;
    min?: number;
    noonSafe?: boolean;
    required?: boolean;
    resetOnSelect?: boolean;
    timeZone?: string | undefined;
  } = {},
): CalendarSelection {
  return resolveCanonicalSelection(mode, normalizeCalendarDate(date, options), current, options);
}

export function isSelectedDate(
  mode: CalendarMode,
  date: Date,
  selected: CalendarSelection,
): boolean {
  if (mode === "single") return selected instanceof Date && isSameCalendarDay(date, selected);
  if (mode === "multiple") {
    return Array.isArray(selected) && selected.some((entry) => isSameCalendarDay(entry, date));
  }
  if (!selected || selected instanceof Date || Array.isArray(selected)) return false;
  if (!selected.from) return false;
  if (!selected.to) return isSameCalendarDay(date, selected.from);
  return (
    compareCalendarDays(date, selected.from) >= 0 && compareCalendarDays(date, selected.to) <= 0
  );
}

export function getRangeFlags(
  date: Date,
  selected: CalendarSelection,
): { rangeEnd: boolean; rangeMiddle: boolean; rangeStart: boolean } {
  if (!selected || selected instanceof Date || Array.isArray(selected) || !selected.from) {
    return { rangeEnd: false, rangeMiddle: false, rangeStart: false };
  }
  const rangeStart = Boolean(selected.to && isSameCalendarDay(date, selected.from));
  const rangeEnd = Boolean(selected.to && isSameCalendarDay(date, selected.to));
  const rangeMiddle = Boolean(
    selected.to &&
      compareCalendarDays(date, selected.from) > 0 &&
      compareCalendarDays(date, selected.to) < 0,
  );
  return { rangeEnd, rangeMiddle, rangeStart };
}

export function getIsoWeekNumber(date: Date): number {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return Math.ceil(((utc.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
}

export function getCalendarWeekNumber(
  date: Date,
  options: { firstWeekContainsDate?: 1 | 4; weekStartsOn?: number } = {},
): number {
  const weekStartsOn = (((options.weekStartsOn ?? 0) % 7) + 7) % 7;
  const firstWeekContainsDate = options.firstWeekContainsDate ?? 1;
  const startOfWeek = (value: Date): Date => {
    const offset = (value.getDay() - weekStartsOn + 7) % 7;
    return addCalendarDays(value, -offset);
  };
  const weekYearStart = (year: number) => startOfWeek(new Date(year, 0, firstWeekContainsDate));
  let weekYear = date.getFullYear();
  if (compareCalendarDays(date, weekYearStart(weekYear)) < 0) weekYear -= 1;
  else if (compareCalendarDays(date, weekYearStart(weekYear + 1)) >= 0) weekYear += 1;
  return Math.floor(differenceInCalendarDays(date, weekYearStart(weekYear)) / 7) + 1;
}
