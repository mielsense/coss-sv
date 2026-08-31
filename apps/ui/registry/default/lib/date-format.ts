const longMonthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

function ordinalSuffix(day: number): string {
  const lastTwoDigits = day % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";

  if (day % 10 === 1) return "st";
  if (day % 10 === 2) return "nd";
  if (day % 10 === 3) return "rd";
  return "th";
}

/** Matches date-fns `format(date, "PPP")` with its default en-US locale. */
export function formatDatePpp(date: Date): string {
  const month = longMonthFormatter.format(date);
  const day = date.getDate();
  return `${month} ${day}${ordinalSuffix(day)}, ${date.getFullYear()}`;
}

export function addCalendarDays(date: Date, amount: number): Date {
  const value = new Date(date);
  value.setDate(value.getDate() + amount);
  return value;
}

export function subtractCalendarMonths(date: Date, amount: number): Date {
  const target = new Date(date);
  const day = target.getDate();
  target.setDate(1);
  target.setMonth(target.getMonth() - amount);
  target.setDate(Math.min(day, new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()));
  return target;
}

export function subtractCalendarYears(date: Date, amount: number): Date {
  const target = new Date(date);
  const month = target.getMonth();
  target.setFullYear(target.getFullYear() - amount, month, 1);
  target.setDate(Math.min(date.getDate(), new Date(target.getFullYear(), month + 1, 0).getDate()));
  return target;
}

export function startOfCalendarMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfCalendarMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function startOfCalendarYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export function endOfCalendarYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

export function formatDateInput(date: Date): string {
  return [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function parseDateInput(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return undefined;
  }
  return date;
}
