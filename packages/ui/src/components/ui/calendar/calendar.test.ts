import { createRawSnippet, type Snippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import Calendar from "./calendar.svelte";
import type { CalendarDayContext } from "./calendar.types.js";
import {
  addCalendarDays,
  buildCalendarMonth,
  isDateMatched,
  resolveSelection,
} from "./calendar.utils.js";

const january = new Date(2026, 0, 1, 12);

describe("Calendar date model", () => {
  test("builds locale-aware weeks with outside days and fixed six-week output", () => {
    const month = buildCalendarMonth(january, { fixedWeeks: true, weekStartsOn: 1 });

    expect(month.weeks).toHaveLength(6);
    expect(month.weeks[0]?.[0]?.date).toEqual(new Date(2025, 11, 29, 12));
    expect(month.weeks[5]?.[6]?.date).toEqual(new Date(2026, 1, 8, 12));
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
    expect(isDateMatched(target, { dayOfWeek: [6] })).toBe(true);
    expect(isDateMatched(target, (date) => date.getDate() === 10)).toBe(true);
  });

  test("enforces single, multiple, and range min/max selection contracts", () => {
    const day1 = new Date(2026, 0, 1, 12);
    const day2 = addCalendarDays(day1, 1);
    const day5 = addCalendarDays(day1, 4);

    expect(resolveSelection("single", day1, undefined, {})).toEqual(day1);
    expect(resolveSelection("single", day1, day1, {})).toBeUndefined();
    expect(resolveSelection("multiple", day2, [day1], { max: 1 })).toEqual([day1]);
    expect(resolveSelection("multiple", day1, [day1, day2], { min: 2 })).toEqual([day1, day2]);
    expect(resolveSelection("range", day5, { from: day1 }, { max: 3 })).toEqual({ from: day5 });
    expect(resolveSelection("range", day2, { from: day1 }, { min: 2 })).toEqual({ from: day1 });
    expect(resolveSelection("range", day5, { from: day1 }, { min: 2, max: 7 })).toEqual({
      from: day1,
      to: day5,
    });
  });
});

describe("Calendar SSR contract", () => {
  test("renders exact COSS slots, class mappings, formatters, and forwarded attributes", () => {
    const selected = new Date(2026, 0, 15, 12);
    const { body } = render(Calendar, {
      props: {
        "aria-label": "Booking calendar",
        class: "custom-root",
        classNames: { day_button: "rounded-full custom-day", month_caption: "custom-caption" },
        defaultMonth: january,
        fixedWeeks: true,
        formatters: {
          formatCaption: () => "January custom",
          formatDay: (date) => `day-${date.getDate()}`,
          formatWeekdayName: (date) => `weekday-${date.getDay()}`,
        },
        mode: "single",
        selected,
      },
    });

    expect(body).toContain('data-slot="calendar"');
    expect(body).toContain('aria-label="Booking calendar"');
    expect(body).toContain("custom-root");
    expect(body).toContain("[--cell-size:--spacing(10)]");
    expect(body).toContain("custom-caption");
    expect(body).toContain("January custom");
    expect(body).toContain("weekday-1");
    expect(body).toContain("day-15");
    expect(body).toContain("custom-day");
    expect(body).toContain('data-selected="true"');
    expect(body).toContain('aria-label="Thursday, January 15th, 2026, selected"');
  });

  test("renders multiple months, hidden outside days, week numbers, dropdowns, and custom days", () => {
    const { body } = render(Calendar, {
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
    const { body } = render(Calendar, {
      props: {
        defaultMonth: january,
        endMonth: new Date(2026, 0, 1, 12),
        locale: "fr-FR",
        startMonth: new Date(2026, 0, 1, 12),
        weekStartsOn: 1,
      },
    });

    expect(body).toContain("janvier 2026");
    expect(body).toContain(">lu</th>");
    expect(body).toContain('aria-label="vendredi 2 janvier 2026"');
    expect(body).toContain('aria-label="vendredi 2 janvier 2026"');
  });
});
