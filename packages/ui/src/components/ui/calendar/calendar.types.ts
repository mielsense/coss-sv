import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type CalendarMode = "multiple" | "range" | "single";
export type CaptionLayout = "dropdown" | "dropdown-months" | "dropdown-years" | "label";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type CalendarSelection = Date | Date[] | DateRange | undefined;

export type DateMatcher =
  | Date
  | Date[]
  | ((date: Date) => boolean)
  | { after: Date; before?: never }
  | { before: Date; after?: never }
  | { after: Date; before: Date }
  | { dayOfWeek: number[] }
  | { from: Date; to: Date };

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

export interface CalendarFormatters {
  formatCaption?: (month: Date, options: { locale: string }) => string;
  formatDay?: (date: Date, options: { locale: string }) => string;
  formatMonthDropdown?: (month: Date, options: { locale: string }) => string;
  formatWeekdayName?: (weekday: Date, options: { locale: string }) => string;
  formatYearDropdown?: (year: number, options: { locale: string }) => string;
}

export interface CalendarDayContext {
  date: Date;
  displayMonth: Date;
  outside: boolean;
  selected: boolean;
  disabled: boolean;
  unavailable: boolean;
  today: boolean;
  rangeStart: boolean;
  rangeMiddle: boolean;
  rangeEnd: boolean;
}

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
  class?: string;
  orientation: "down" | "left" | "right" | "up";
}

export interface CalendarWeekNumberContext {
  dates: readonly Date[];
  weekNumber: number;
}

export interface CalendarComponents {
  Chevron?: Snippet<[CalendarChevronContext]>;
  DayButton?: Snippet<[CalendarDayContext]>;
  Dropdown?: Snippet<[CalendarDropdownContext]>;
  DropdownNav?: Snippet<[CalendarDropdownNavContext]>;
  WeekNumber?: Snippet<[CalendarWeekNumberContext]>;
}

export type CalendarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "class" | "onkeydown" | "onselect"
> & {
  captionLayout?: CaptionLayout;
  class?: string;
  className?: string;
  classNames?: CalendarClassNames;
  components?: CalendarComponents;
  day?: Snippet<[CalendarDayContext]>;
  defaultMonth?: Date;
  defaultSelected?: CalendarSelection;
  disabled?: DateMatcher | DateMatcher[];
  endMonth?: Date;
  excludeDisabled?: boolean;
  fixedWeeks?: boolean;
  formatters?: CalendarFormatters;
  hideNavigation?: boolean;
  locale?: string;
  max?: number;
  maxDate?: Date;
  min?: number;
  minDate?: Date;
  mode?: CalendarMode;
  modifiers?: Record<string, DateMatcher | DateMatcher[]>;
  month?: Date;
  numberOfMonths?: number;
  onDayClick?: (date: Date, event: MouseEvent) => void;
  onMonthChange?: (month: Date) => void;
  onSelect?: (selection: CalendarSelection) => void;
  pagedNavigation?: boolean;
  ref?: HTMLDivElement | null;
  required?: boolean;
  reverseMonths?: boolean;
  selected?: CalendarSelection;
  showOutsideDays?: boolean;
  showWeekNumber?: boolean;
  startMonth?: Date;
  unavailable?: DateMatcher | DateMatcher[];
  weekNumber?: Snippet<[CalendarWeekNumberContext]>;
  weekStartsOn?: number;
};
