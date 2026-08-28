import type { CalendarMode, CalendarSelection, DateMatcher } from "./calendar.types.js";

const DAY_MS = 86_400_000;

export function normalizeCalendarDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

export function startOfCalendarMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

export function addCalendarDays(date: Date, amount: number): Date {
  const next = normalizeCalendarDate(date);
  next.setDate(next.getDate() + amount);
  return normalizeCalendarDate(next);
}

export function addCalendarMonths(date: Date, amount: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
  return startOfCalendarMonth(next);
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
  return normalizeCalendarDate(left).getTime() - normalizeCalendarDate(right).getTime();
}

export function differenceInCalendarDays(left: Date, right: Date): number {
  const utcLeft = Date.UTC(left.getFullYear(), left.getMonth(), left.getDate());
  const utcRight = Date.UTC(right.getFullYear(), right.getMonth(), right.getDate());
  return Math.round((utcLeft - utcRight) / DAY_MS);
}

export function isDateMatched(
  date: Date,
  matcher: DateMatcher | DateMatcher[] | undefined,
): boolean {
  if (!matcher) return false;
  if (Array.isArray(matcher)) {
    if (matcher.length === 0) return false;
    if (matcher.every((entry) => entry instanceof Date)) {
      return matcher.some((entry) => isSameCalendarDay(date, entry as Date));
    }
    return matcher.some((entry) => isDateMatched(date, entry));
  }
  if (matcher instanceof Date) return isSameCalendarDay(date, matcher);
  if (typeof matcher === "function") return matcher(normalizeCalendarDate(date));
  if ("dayOfWeek" in matcher) return matcher.dayOfWeek.includes(date.getDay());
  if ("from" in matcher && "to" in matcher) {
    return (
      compareCalendarDays(date, matcher.from) >= 0 && compareCalendarDays(date, matcher.to) <= 0
    );
  }
  if ("before" in matcher && "after" in matcher && matcher.before && matcher.after) {
    return (
      compareCalendarDays(date, matcher.after) > 0 && compareCalendarDays(date, matcher.before) < 0
    );
  }
  if ("before" in matcher && matcher.before) return compareCalendarDays(date, matcher.before) < 0;
  if ("after" in matcher && matcher.after) return compareCalendarDays(date, matcher.after) > 0;
  return false;
}

export interface CalendarMonthModel {
  value: Date;
  weeks: Array<Array<{ date: Date; outside: boolean }>>;
}

export function buildCalendarMonth(
  month: Date,
  options: { fixedWeeks?: boolean; weekStartsOn?: number } = {},
): CalendarMonthModel {
  const value = startOfCalendarMonth(month);
  const weekStartsOn = (((options.weekStartsOn ?? 0) % 7) + 7) % 7;
  const firstOffset = (value.getDay() - weekStartsOn + 7) % 7;
  const firstDate = addCalendarDays(value, -firstOffset);
  const lastOfMonth = new Date(value.getFullYear(), value.getMonth() + 1, 0, 12);
  const naturalCells = firstOffset + lastOfMonth.getDate();
  const cellCount = options.fixedWeeks ? 42 : Math.ceil(naturalCells / 7) * 7;
  const weeks: CalendarMonthModel["weeks"] = [];

  for (let offset = 0; offset < cellCount; offset += 7) {
    const week: CalendarMonthModel["weeks"][number] = [];
    for (let day = 0; day < 7; day += 1) {
      const date = addCalendarDays(firstDate, offset + day);
      week.push({ date, outside: date.getMonth() !== value.getMonth() });
    }
    weeks.push(week);
  }
  return { value, weeks };
}

function sortedRange(from: Date, to: Date): { from: Date; to: Date } {
  return compareCalendarDays(from, to) <= 0 ? { from, to } : { from: to, to: from };
}

export function resolveSelection(
  mode: CalendarMode,
  date: Date,
  current: CalendarSelection,
  options: { max?: number; min?: number; required?: boolean } = {},
): CalendarSelection {
  const nextDate = normalizeCalendarDate(date);
  if (mode === "single") {
    const selected = current instanceof Date ? current : undefined;
    if (isSameCalendarDay(selected, nextDate)) return options.required ? selected : undefined;
    return nextDate;
  }

  if (mode === "multiple") {
    const selected = Array.isArray(current) ? current.map(normalizeCalendarDate) : [];
    const index = selected.findIndex((entry) => isSameCalendarDay(entry, nextDate));
    if (index >= 0) {
      if (options.required && selected.length === 1) return selected;
      if (options.min !== undefined && selected.length <= options.min) return selected;
      return selected.filter((_, itemIndex) => itemIndex !== index);
    }
    if (options.max !== undefined && selected.length >= options.max) return selected;
    return [...selected, nextDate].sort(compareCalendarDays);
  }

  const range = current && !(current instanceof Date) && !Array.isArray(current) ? current : {};
  if (!range.from || range.to) return { from: nextDate };
  const candidate = sortedRange(normalizeCalendarDate(range.from), nextDate);
  const length = Math.abs(differenceInCalendarDays(candidate.to, candidate.from));
  if (options.max !== undefined && length > options.max) return { from: nextDate };
  if (options.min !== undefined && length < options.min) return { from: range.from };
  return candidate;
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
): {
  rangeEnd: boolean;
  rangeMiddle: boolean;
  rangeStart: boolean;
} {
  if (!selected || selected instanceof Date || Array.isArray(selected) || !selected.from) {
    return { rangeEnd: false, rangeMiddle: false, rangeStart: false };
  }
  const rangeStart = isSameCalendarDay(date, selected.from);
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
