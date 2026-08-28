import type { Snippet } from "svelte";
import type { HTMLAttributes, HTMLButtonAttributes, HTMLThAttributes } from "svelte/elements";

export type CalendarMode = "multiple" | "range" | "single";
export type CaptionLayout = "dropdown" | "dropdown-months" | "dropdown-years" | "label";

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export type CalendarSelection = Date | Date[] | DateRange | undefined;

export type DateMatcher =
  | boolean
  | Date
  | Date[]
  | ((date: Date) => boolean)
  | { after: Date; before?: never }
  | { before: Date; after?: never }
  | { after: Date; before: Date }
  | { dayOfWeek: number | number[] }
  | { from: Date | undefined; to?: Date | undefined };

export interface CalendarLocale {
  [key: string]: unknown;
  code?: string;
  options?: {
    firstWeekContainsDate?: 1 | 4;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  };
  localize?: unknown;
}

export interface CalendarClassNames {
  [part: string]: string | undefined;
  button_next?: string;
  button_previous?: string;
  caption_label?: string;
  day?: string;
  day_button?: string;
  dropdown?: string;
  dropdown_root?: string;
  dropdowns?: string;
  hidden?: string;
  month?: string;
  month_caption?: string;
  months?: string;
  nav?: string;
  outside?: string;
  range_end?: string;
  range_middle?: string;
  range_start?: string;
  today?: string;
  week_number?: string;
  weekday?: string;
}

export interface CalendarFormatterOptions {
  locale: CalendarLocale;
  localeCode: string;
  timeZone?: string | undefined;
}

export interface CalendarFormatters {
  formatCaption?: (month: Date, options: CalendarFormatterOptions) => string;
  formatDay?: (date: Date, options: CalendarFormatterOptions) => string;
  formatMonthDropdown?: (month: Date, options: CalendarFormatterOptions) => string;
  formatWeekdayName?: (weekday: Date, options: CalendarFormatterOptions) => string;
  formatYearDropdown?: (year: number, options: CalendarFormatterOptions) => string;
}

export interface CalendarDayModel {
  date: Date;
  displayMonth: Date;
  outside: boolean;
}

export interface CalendarModifiers {
  [name: string]: boolean;
  disabled: boolean;
  focused: boolean;
  outside: boolean;
  range_end: boolean;
  range_middle: boolean;
  range_start: boolean;
  selected: boolean;
  today: boolean;
  unavailable: boolean;
}

export interface CalendarDayContext extends CalendarDayModel {
  disabled: boolean;
  rangeEnd: boolean;
  rangeMiddle: boolean;
  rangeStart: boolean;
  selected: boolean;
  today: boolean;
  unavailable: boolean;
}

export type CalendarDayButtonProps = Omit<HTMLButtonAttributes, "children"> & {
  children: Snippet;
  day: CalendarDayModel;
  modifiers: CalendarModifiers;
};

export interface CalendarDropdownContext {
  "aria-label": string;
  disabled: boolean;
  kind: "month" | "year";
  onChange: (value: number) => void;
  options: ReadonlyArray<{ disabled?: boolean; label: string; value: number }>;
  value: number;
}

export interface CalendarDropdownNavContext {
  children: Snippet;
  class: string | undefined;
}

export interface CalendarChevronContext {
  class?: string | undefined;
  orientation: "down" | "left" | "right" | "up";
}

export interface CalendarWeekModel {
  days: readonly CalendarDayModel[];
  weekNumber: number;
}

export interface CalendarWeekNumberContext {
  dates: readonly Date[];
  weekNumber: number;
}

export type CalendarWeekNumberProps = Omit<HTMLThAttributes, "children"> & {
  children: Snippet;
  week: CalendarWeekModel;
};

export interface CalendarComponents {
  Chevron?: Snippet<[CalendarChevronContext]>;
  DayButton?: Snippet<[CalendarDayButtonProps]>;
  Dropdown?: Snippet<[CalendarDropdownContext]>;
  DropdownNav?: Snippet<[CalendarDropdownNavContext]>;
  WeekNumber?: Snippet<[CalendarWeekNumberProps]>;
}

export interface CalendarLabels {
  labelDayButton?: (date: Date, modifiers: CalendarModifiers) => string;
  labelMonthDropdown?: (month: Date) => string;
  labelNext?: (month: Date | undefined) => string;
  labelPrevious?: (month: Date | undefined) => string;
  labelWeekNumber?: (weekNumber: number) => string;
  labelWeekNumberHeader?: () => string;
  labelYearDropdown?: (year: number) => string;
}

type CalendarRootProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "class" | "onkeydown" | "onselect"
>;

interface CalendarBaseProps extends CalendarRootProps {
  autoFocus?: boolean;
  captionLayout?: CaptionLayout;
  class?: string;
  className?: string;
  classNames?: CalendarClassNames;
  components?: CalendarComponents;
  day?: Snippet<[CalendarDayContext]>;
  defaultMonth?: Date;
  disableNavigation?: boolean;
  disabled?: DateMatcher | DateMatcher[];
  endMonth?: Date;
  fixedWeeks?: boolean;
  formatters?: CalendarFormatters;
  hideNavigation?: boolean;
  hideWeekdays?: boolean;
  labels?: CalendarLabels;
  locale?: CalendarLocale;
  maxDate?: Date;
  minDate?: Date;
  modifiers?: Record<string, DateMatcher | DateMatcher[]>;
  month?: Date;
  noonSafe?: boolean;
  numberOfMonths?: number;
  onDayBlur?: (date: Date, modifiers: CalendarModifiers, event: FocusEvent) => void;
  onDayClick?: (date: Date, modifiers: CalendarModifiers, event: MouseEvent) => void;
  onDayFocus?: (date: Date, modifiers: CalendarModifiers, event: FocusEvent) => void;
  onDayKeyDown?: (date: Date, modifiers: CalendarModifiers, event: KeyboardEvent) => void;
  onDayMouseEnter?: (date: Date, modifiers: CalendarModifiers, event: MouseEvent) => void;
  onDayMouseLeave?: (date: Date, modifiers: CalendarModifiers, event: MouseEvent) => void;
  onMonthChange?: (month: Date) => void;
  onNextClick?: (month: Date) => void;
  onPrevClick?: (month: Date) => void;
  pagedNavigation?: boolean;
  ref?: HTMLDivElement | null;
  reverseMonths?: boolean;
  reverseYears?: boolean;
  showOutsideDays?: boolean;
  showWeekNumber?: boolean;
  startMonth?: Date;
  timeZone?: string;
  today?: Date;
  unavailable?: DateMatcher | DateMatcher[];
  weekNumber?: Snippet<[CalendarWeekNumberContext]>;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export type CalendarSelectEvent = KeyboardEvent | MouseEvent;

export interface CalendarSingleProps extends CalendarBaseProps {
  defaultSelected?: Date | undefined;
  excludeDisabled?: never;
  max?: never;
  min?: never;
  mode?: "single";
  onSelect?: (
    selected: Date | undefined,
    triggerDate: Date,
    modifiers: CalendarModifiers,
    event: CalendarSelectEvent,
  ) => void;
  required?: false | undefined;
  resetOnSelect?: never;
  selected?: Date | undefined;
}

export interface CalendarSingleRequiredProps extends CalendarBaseProps {
  defaultSelected?: Date;
  excludeDisabled?: never;
  max?: never;
  min?: never;
  mode?: "single";
  onSelect?: (
    selected: Date,
    triggerDate: Date,
    modifiers: CalendarModifiers,
    event: CalendarSelectEvent,
  ) => void;
  required: true;
  resetOnSelect?: never;
  selected: Date | undefined;
}

export interface CalendarMultipleProps extends CalendarBaseProps {
  defaultSelected?: Date[] | undefined;
  excludeDisabled?: never;
  max?: number;
  min?: number;
  mode: "multiple";
  onSelect?: (
    selected: Date[] | undefined,
    triggerDate: Date,
    modifiers: CalendarModifiers,
    event: CalendarSelectEvent,
  ) => void;
  required?: false | undefined;
  resetOnSelect?: never;
  selected?: Date[] | undefined;
}

export interface CalendarMultipleRequiredProps extends CalendarBaseProps {
  defaultSelected?: Date[];
  excludeDisabled?: never;
  max?: number;
  min?: number;
  mode: "multiple";
  onSelect?: (
    selected: Date[],
    triggerDate: Date,
    modifiers: CalendarModifiers,
    event: CalendarSelectEvent,
  ) => void;
  required: true;
  resetOnSelect?: never;
  selected: Date[] | undefined;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  defaultSelected?: DateRange | undefined;
  excludeDisabled?: boolean;
  max?: number;
  min?: number;
  mode: "range";
  onSelect?: (
    selected: DateRange | undefined,
    triggerDate: Date,
    modifiers: CalendarModifiers,
    event: CalendarSelectEvent,
  ) => void;
  required?: false | undefined;
  resetOnSelect?: boolean;
  selected?: DateRange | undefined;
}

export interface CalendarRangeRequiredProps extends CalendarBaseProps {
  defaultSelected?: DateRange;
  excludeDisabled?: boolean;
  max?: number;
  min?: number;
  mode: "range";
  onSelect?: (
    selected: DateRange,
    triggerDate: Date,
    modifiers: CalendarModifiers,
    event: CalendarSelectEvent,
  ) => void;
  required: true;
  resetOnSelect?: boolean;
  selected: DateRange | undefined;
}

export type CalendarProps =
  | CalendarMultipleProps
  | CalendarMultipleRequiredProps
  | CalendarRangeProps
  | CalendarRangeRequiredProps
  | CalendarSingleProps
  | CalendarSingleRequiredProps;
