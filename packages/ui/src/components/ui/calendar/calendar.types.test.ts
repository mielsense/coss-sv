import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type {
  CalendarDayButtonProps,
  CalendarComponents,
  CalendarMultipleProps,
  CalendarMultipleRequiredProps,
  CalendarProps,
  CalendarRangeRequiredProps,
  CalendarSingleRequiredProps,
  CalendarWeekNumberProps,
} from "./index.js";

const date = new Date(2026, 0, 15);

test("discriminates mode, required selection, and callback values", () => {
  const single = {
    mode: "single",
    onSelect: (selected, triggerDate, modifiers, event) => {
      expectTypeOf(selected).toEqualTypeOf<Date | undefined>();
      expectTypeOf(triggerDate).toEqualTypeOf<Date>();
      expectTypeOf(modifiers.selected).toEqualTypeOf<boolean>();
      expectTypeOf(event).toEqualTypeOf<KeyboardEvent | MouseEvent>();
    },
    selected: date,
  } satisfies CalendarProps;
  const requiredSingle = {
    mode: "single",
    onSelect: (selected) => expectTypeOf(selected).toEqualTypeOf<Date>(),
    required: true,
    selected: date,
  } satisfies CalendarSingleRequiredProps;
  const requiredMultiple = {
    mode: "multiple",
    onSelect: (selected) => expectTypeOf(selected).toEqualTypeOf<Date[]>(),
    required: true,
    selected: [date],
  } satisfies CalendarMultipleRequiredProps;
  const requiredRange = {
    mode: "range",
    onSelect: (selected) =>
      expectTypeOf(selected).toEqualTypeOf<{
        from: Date | undefined;
        to?: Date | undefined;
      }>(),
    required: true,
    selected: { from: date },
  } satisfies CalendarRangeRequiredProps;

  expect(single.mode).toBe("single");
  expect(requiredSingle.required).toBe(true);
  expect(requiredMultiple.mode).toBe("multiple");
  expect(requiredRange.mode).toBe("range");
});

test("rejects invalid mode, selection, and required combinations", () => {
  const wrongSingle: import("./index.js").CalendarSingleProps = {
    mode: "single",
    // @ts-expect-error Single mode cannot receive an array selection.
    selected: [date],
  };
  // @ts-expect-error Required modes must explicitly provide their controlled selection.
  const missingRequiredSelection: CalendarMultipleRequiredProps = {
    mode: "multiple",
    required: true,
  };
  const rangeOnlyProp: CalendarMultipleProps = {
    mode: "multiple",
    // @ts-expect-error resetOnSelect belongs to range selection only.
    resetOnSelect: true,
  };

  expect(wrongSingle.mode).toBe("single");
  expect(missingRequiredSelection.required).toBe(true);
  expect(rangeOnlyProp.resetOnSelect).toBe(true);
});

test("types full replacement DayButton and WeekNumber host props", () => {
  const children = createRawSnippet(() => ({ render: () => "15" }));
  const dayButton = {
    "aria-label": "Thursday, January 15th, 2026",
    children,
    class: "day-button",
    day: { date, displayMonth: new Date(2026, 0, 1), outside: false },
    disabled: false,
    modifiers: {
      disabled: false,
      focused: true,
      hidden: false,
      outside: false,
      range_end: false,
      range_middle: false,
      range_start: false,
      selected: true,
      today: false,
      unavailable: false,
    },
    onclick: () => undefined,
    tabindex: 0,
    type: "button",
  } satisfies CalendarDayButtonProps;
  const weekNumber = {
    "aria-label": "Week 3",
    children,
    class: "week-number",
    role: "rowheader",
    scope: "row",
    week: { days: [dayButton.day], weekNumber: 3 },
  } satisfies CalendarWeekNumberProps;

  expect(dayButton.day.date).toBe(date);
  expect(weekNumber.week.weekNumber).toBe(3);
});

test("exposes every DayPicker 10 replacement component key", () => {
  expectTypeOf<keyof CalendarComponents>().toEqualTypeOf<
    | "CaptionLabel"
    | "Chevron"
    | "Day"
    | "DayButton"
    | "Dropdown"
    | "DropdownNav"
    | "Footer"
    | "Month"
    | "MonthCaption"
    | "MonthGrid"
    | "Months"
    | "MonthsDropdown"
    | "Nav"
    | "NextMonthButton"
    | "Option"
    | "PreviousMonthButton"
    | "Root"
    | "Select"
    | "Week"
    | "Weekday"
    | "Weekdays"
    | "WeekNumber"
    | "WeekNumberHeader"
    | "Weeks"
    | "YearsDropdown"
  >();
  expect(true).toBe(true);
});
