import { describe, expect, test } from "vitest";
import {
  addCalendarDays,
  endOfCalendarMonth,
  endOfCalendarYear,
  formatDateInput,
  formatDatePpp,
  parseDateInput,
  startOfCalendarMonth,
  startOfCalendarYear,
  subtractCalendarMonths,
  subtractCalendarYears,
} from "../../registry/default/lib/date-format.js";

describe("COSS date-fns-compatible display formatting", () => {
  test.each([
    [new Date(2026, 7, 1, 12), "August 1st, 2026"],
    [new Date(2026, 7, 2, 12), "August 2nd, 2026"],
    [new Date(2026, 7, 3, 12), "August 3rd, 2026"],
    [new Date(2026, 7, 11, 12), "August 11th, 2026"],
    [new Date(2026, 7, 12, 12), "August 12th, 2026"],
    [new Date(2026, 7, 13, 12), "August 13th, 2026"],
    [new Date(2026, 7, 21, 12), "August 21st, 2026"],
    [new Date(2026, 7, 28, 12), "August 28th, 2026"],
  ])("formats PPP ordinal semantics for %s", (date, expected) => {
    expect(formatDatePpp(date)).toBe(expected);
  });
});

describe("local calendar arithmetic", () => {
  test("adds days and clamps month and year subtraction like date-fns", () => {
    expect(addCalendarDays(new Date(2026, 2, 31, 12), 1)).toEqual(new Date(2026, 3, 1, 12));
    expect(subtractCalendarMonths(new Date(2026, 2, 31, 12), 1)).toEqual(new Date(2026, 1, 28, 12));
    expect(subtractCalendarYears(new Date(2024, 1, 29, 12), 1)).toEqual(new Date(2023, 1, 28, 12));
  });

  test("returns local month and year boundaries", () => {
    const value = new Date(2024, 1, 15, 12);
    expect(startOfCalendarMonth(value)).toEqual(new Date(2024, 1, 1));
    expect(endOfCalendarMonth(value)).toEqual(new Date(2024, 1, 29, 23, 59, 59, 999));
    expect(startOfCalendarYear(value)).toEqual(new Date(2024, 0, 1));
    expect(endOfCalendarYear(value)).toEqual(new Date(2024, 11, 31, 23, 59, 59, 999));
  });

  test("strictly parses and formats local yyyy-MM-dd values", () => {
    expect(parseDateInput("2026-02-28")).toEqual(new Date(2026, 1, 28));
    expect(parseDateInput("2026-02-31")).toBeUndefined();
    expect(parseDateInput("2026-2-28")).toBeUndefined();
    expect(parseDateInput("nope")).toBeUndefined();
    expect(formatDateInput(new Date(2026, 7, 8, 12))).toBe("2026-08-08");
  });
});
