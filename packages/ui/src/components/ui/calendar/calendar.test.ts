import { createRawSnippet, type Component, type Snippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test, vi } from "vitest";
import Calendar from "./calendar.svelte";
import type { CalendarDayContext, CalendarSingleProps } from "./calendar.types.js";
import {
  addCalendarDays,
  addCalendarMonths,
  buildCalendarMonth,
  differenceInCalendarMonths,
  getCalendarWeekNumber,
  getIsoWeekNumber,
  isDateMatched,
  normalizeCalendarDate,
  resolveSelection,
} from "./calendar.utils.js";

const january = new Date(2026, 0, 1, 12);
const SingleCalendar = Calendar as Component<CalendarSingleProps>;

describe("Calendar date model", () => {
  test("builds locale-aware weeks with outside days and fixed six-week output", () => {
    const month = buildCalendarMonth(january, { fixedWeeks: true, weekStartsOn: 1 });

    expect(month.weeks).toHaveLength(6);
    expect(month.weeks[0]?.[0]?.date).toEqual(new Date(2025, 11, 29));
    expect(month.weeks[5]?.[6]?.date).toEqual(new Date(2026, 1, 8));
  });

  test("preserves the day when moving by month and clamps only at the month end", () => {
    expect(addCalendarMonths(new Date(2026, 0, 17, 12), 1)).toEqual(new Date(2026, 1, 17));
    expect(addCalendarMonths(new Date(2026, 0, 31, 12), 1)).toEqual(new Date(2026, 1, 28));
    expect(addCalendarMonths(new Date(2024, 1, 29, 12), 12)).toEqual(new Date(2025, 1, 28));
  });

  test("matches every COSS disabled-date matcher shape", () => {
    const target = new Date(2026, 0, 10, 12);
    expect(isDateMatched(target, new Date(2026, 0, 10))).toBe(true);
    expect(isDateMatched(target, [new Date(2026, 0, 9), new Date(2026, 0, 10)])).toBe(true);
    expect(isDateMatched(target, { before: new Date(2026, 0, 11) })).toBe(true);
    expect(isDateMatched(target, { after: new Date(2026, 0, 9) })).toBe(true);
    expect(isDateMatched(target, { from: new Date(2026, 0, 8), to: new Date(2026, 0, 12) })).toBe(
      true,
    );
    expect(isDateMatched(target, { from: new Date(2026, 0, 10) })).toBe(true);
    expect(isDateMatched(target, { from: undefined, to: new Date(2026, 0, 10) })).toBe(true);
    expect(isDateMatched(target, { dayOfWeek: [6] })).toBe(true);
    expect(isDateMatched(target, { dayOfWeek: 6 })).toBe(true);
    expect(isDateMatched(target, true)).toBe(true);
    expect(isDateMatched(target, false)).toBe(false);
    expect(isDateMatched(target, (date) => date.getDate() === 10)).toBe(true);
  });

  test("matches reversed date intervals outside their open boundaries", () => {
    const matcher = { after: new Date(2026, 0, 20), before: new Date(2026, 0, 10) };

    expect(isDateMatched(new Date(2026, 0, 5), matcher)).toBe(true);
    expect(isDateMatched(new Date(2026, 0, 15), matcher)).toBe(false);
    expect(isDateMatched(new Date(2026, 0, 25), matcher)).toBe(true);
    expect(isDateMatched(new Date(2026, 0, 10), matcher)).toBe(false);
    expect(isDateMatched(new Date(2026, 0, 20), matcher)).toBe(false);
  });

  test("enforces single, multiple, and range min/max selection contracts", () => {
    const day1 = new Date(2026, 0, 1);
    const day2 = addCalendarDays(day1, 1);
    const day5 = addCalendarDays(day1, 4);

    expect(resolveSelection("single", day1, undefined, {})).toEqual(day1);
    expect(resolveSelection("single", day1, day1, {})).toBeUndefined();
    expect(resolveSelection("multiple", day2, [day1], { max: 1 })).toEqual([new Date(2026, 0, 2)]);
    expect(resolveSelection("multiple", day1, [day1, day2], { min: 2 })).toEqual([day1, day2]);
    expect(resolveSelection("range", day5, { from: day1 }, { max: 3 })).toEqual({ from: day5 });
    expect(resolveSelection("range", day2, { from: day1 }, { min: 2 })).toEqual({ from: day2 });
    expect(resolveSelection("range", day5, { from: day1 }, { min: 2, max: 7 })).toEqual({
      from: day1,
      to: day5,
    });
  });

  test("matches DayPicker range reset semantics", () => {
    const day1 = new Date(2026, 0, 1);
    const day2 = new Date(2026, 0, 2);
    const day3 = new Date(2026, 0, 3);

    expect(resolveSelection("range", day1, undefined)).toEqual({ from: day1, to: day1 });
    expect(resolveSelection("range", day3, { from: day1, to: day2 })).toEqual({
      from: day1,
      to: day3,
    });
    expect(
      resolveSelection("range", day3, { from: day1, to: day2 }, { resetOnSelect: true }),
    ).toEqual({ from: day3 });
  });

  test("normalizes instants to the requested time-zone day and noon-safe anchor", () => {
    const instant = new Date("2026-01-01T01:30:00.000Z");

    expect(normalizeCalendarDate(instant, { timeZone: "America/Los_Angeles" })).toEqual(
      new Date(2025, 11, 31),
    );
    expect(
      normalizeCalendarDate(instant, { noonSafe: true, timeZone: "America/Los_Angeles" }),
    ).toEqual(new Date(2025, 11, 31, 12));
    expect(differenceInCalendarMonths(new Date(2027, 0, 1), new Date(2026, 11, 1))).toBe(1);
    expect(getCalendarWeekNumber(new Date(2023, 0, 1), { weekStartsOn: 0 })).toBe(1);
    expect(getIsoWeekNumber(new Date(2023, 0, 1))).toBe(52);
  });

  test("returns noon-safe time-zone dates from every selection mode", () => {
    const instant = new Date("2026-01-01T01:30:00.000Z");
    const options = { noonSafe: true, timeZone: "America/Los_Angeles" };
    const single = resolveSelection("single", instant, undefined, options);
    const multiple = resolveSelection("multiple", instant, undefined, options);
    const range = resolveSelection("range", instant, undefined, { ...options, min: 1 });

    expect(single).toEqual(new Date(2025, 11, 31, 12));
    expect(multiple).toEqual([new Date(2025, 11, 31, 12)]);
    expect(range).toEqual({ from: new Date(2025, 11, 31, 12) });
  });
});

describe("Calendar SSR contract", () => {
  test("keeps defaultSelected when a callback does not supply a controlled value", () => {
    const body = render(SingleCalendar, {
      props: {
        defaultMonth: new Date(2026, 0, 1),
        defaultSelected: new Date(2026, 0, 15),
        mode: "single",
        onSelect: () => undefined,
      },
    }).body;

    expect(body).toMatch(/data-day="2026-01-15"[^>]*data-selected="true"/);
  });

  test("computes default today per instance and honors a controllable today prop", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-01-01T01:30:00.000Z"));
      const first = render(SingleCalendar, {
        props: {
          defaultMonth: new Date("2026-01-01T01:30:00.000Z"),
          mode: "single",
          timeZone: "America/Los_Angeles",
        },
      }).body;
      vi.setSystemTime(new Date("2026-01-02T09:00:00.000Z"));
      const second = render(SingleCalendar, {
        props: {
          defaultMonth: new Date(2026, 0, 1),
          mode: "single",
          timeZone: "America/Los_Angeles",
        },
      }).body;
      const controlled = render(SingleCalendar, {
        props: {
          defaultMonth: new Date(2030, 4, 1),
          mode: "single",
          today: new Date(2030, 4, 20),
        },
      }).body;

      expect(first).toMatch(/data-day="2025-12-31"[^>]*data-today="true"/);
      expect(second).toMatch(/data-day="2026-01-02"[^>]*data-today="true"/);
      expect(controlled).toMatch(/data-day="2030-05-20"[^>]*data-today="true"/);
    } finally {
      vi.useRealTimers();
    }
  });

  test("renders exact COSS slots, class mappings, formatters, and forwarded attributes", () => {
    const selected = new Date(2026, 0, 15, 12);
    const props = {
      "aria-label": "Booking calendar",
      class: "custom-root",
      classNames: { day_button: "rounded-full custom-day", month_caption: "custom-caption" },
      defaultMonth: january,
      fixedWeeks: true,
      formatters: {
        formatCaption: () => "January custom",
        formatDay: (date: Date) => `day-${date.getDate()}`,
        formatWeekdayName: (date: Date) => `weekday-${date.getDay()}`,
      },
      mode: "single",
      selected,
    } satisfies CalendarSingleProps;
    const { body } = render(SingleCalendar, {
      props,
    });

    expect(body).toContain('data-slot="calendar"');
    expect(body).toContain('class="rdp-root');
    expect(body).toContain('data-mode="single"');
    expect(body).toContain('lang="en-US"');
    expect(body).toContain('aria-label="Booking calendar"');
    expect(body).toContain("custom-root");
    expect(body).toContain("[--cell-size:--spacing(10)]");
    expect(body).toContain("custom-caption");
    expect(body).toContain("January custom");
    expect(body).toContain("weekday-1");
    expect(body).toContain("day-15");
    expect(body).toContain("custom-day");
    expect(body).toContain('data-selected="true"');
    expect(body).not.toContain('data-focused="true"');
    expect(body).toContain("rdp-selected");
    expect(body).toContain("rdp-month_grid");
    expect(body).toContain("rdp-weekdays");
    expect(body).toContain("rdp-weeks");
    expect(body).toContain("rdp-week");
    expect(body).toContain('role="status" aria-live="polite"');
    expect(body).toContain('<thead aria-hidden="true">');
    expect(body).toContain('aria-label="Monday"');
    expect(body).toContain('aria-label="Thursday, January 15th, 2026, selected"');
  });

  test("renders multiple months, hidden outside days, week numbers, dropdowns, and custom days", () => {
    const { body } = render(SingleCalendar, {
      props: {
        captionLayout: "dropdown",
        day: createRawSnippet<[CalendarDayContext]>((getContext) => ({
          render: () => `<span data-custom-day>${getContext().date.getDate()}</span>`,
        })) as Snippet<[CalendarDayContext]>,
        defaultMonth: january,
        endMonth: new Date(2027, 11, 1),
        fixedWeeks: true,
        numberOfMonths: 2,
        showOutsideDays: false,
        showWeekNumber: true,
        startMonth: new Date(2025, 0, 1),
      },
    });

    expect(body.match(/data-slot="calendar-month"/g)).toHaveLength(2);
    expect(body).toContain('aria-label="Choose the Month"');
    expect(body).toContain('aria-label="Choose the Year"');
    expect(body).toContain('data-slot="week-number"');
    expect(body).toContain("invisible");
    expect(body).toContain("data-custom-day");
  });

  test("uses the requested locale and week start without treating navigation bounds as disabled dates", () => {
    const { body } = render(SingleCalendar, {
      props: {
        defaultMonth: january,
        endMonth: new Date(2026, 0, 1, 12),
        locale: { code: "fr-FR", options: { weekStartsOn: 1 } },
        startMonth: new Date(2026, 0, 1, 12),
      },
    });

    expect(body).toContain("janvier 2026");
    expect(body).toContain(">lu</th>");
    expect(body).toContain('aria-label="vendredi 2 janvier 2026"');
    expect(body).toContain('aria-label="vendredi 2 janvier 2026"');
  });
});
