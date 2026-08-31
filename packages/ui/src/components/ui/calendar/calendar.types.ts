import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";
import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLOptionAttributes,
  HTMLSelectAttributes,
  HTMLTableAttributes,
  HTMLTdAttributes,
  HTMLThAttributes,
} from "svelte/elements";

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
  firstWeekContainsDate: 1 | 4;
  locale: CalendarLocale;
  localeCode: string;
  numerals: CalendarNumerals;
  timeZone?: string | undefined;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CalendarFormatters {
  formatCaption?: (month: Date, options: CalendarFormatterOptions) => string;
  formatDay?: (date: Date, options: CalendarFormatterOptions) => string;
  /** @deprecated Use `formatCaption`. */
  formatMonthCaption?: (month: Date, options: CalendarFormatterOptions) => string;
  formatMonthDropdown?: (month: Date, options: CalendarFormatterOptions) => string;
  formatWeekNumber?: (weekNumber: number, options: CalendarFormatterOptions) => string;
  formatWeekNumberHeader?: (options: CalendarFormatterOptions) => string;
  formatWeekdayName?: (weekday: Date, options: CalendarFormatterOptions) => string;
  /** @deprecated Use `formatYearDropdown`. */
  formatYearCaption?: (year: Date, options: CalendarFormatterOptions) => string;
  formatYearDropdown?: (year: Date, options: CalendarFormatterOptions) => string;
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
  hidden: boolean;
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
  hidden: boolean;
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
  class?: string | undefined;
  disabled: boolean;
  kind: "month" | "year";
  onChange: (value: number) => void;
  options: ReadonlyArray<{ disabled?: boolean; label: string; value: number }>;
  style?: CalendarStyle;
  value: number;
}

export interface CalendarDropdownNavContext {
  children: Snippet;
  class: string | undefined;
  style?: CalendarStyle;
}

export interface CalendarChevronContext {
  class?: string | undefined;
  disabled?: boolean | undefined;
  orientation?: "down" | "left" | "right" | "up";
  size?: number | undefined;
  style?: CalendarStyle;
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

type CalendarHostProps<Attributes> = Omit<Attributes, "children"> & { children: Snippet };

export interface CalendarMonthModel {
  date: Date;
  weeks: readonly CalendarWeekModel[];
}

export type CalendarCaptionLabelProps = CalendarHostProps<HTMLAttributes<HTMLSpanElement>>;
export type CalendarDayProps = CalendarHostProps<HTMLTdAttributes> & {
  day: CalendarDayModel;
  modifiers: CalendarModifiers;
};
export type CalendarFooterProps = CalendarHostProps<HTMLAttributes<HTMLDivElement>>;
export type CalendarMonthProps = CalendarHostProps<HTMLAttributes<HTMLDivElement>> & {
  calendarMonth: CalendarMonthModel;
  displayIndex: number;
};
export type CalendarMonthCaptionProps = CalendarMonthProps;
export type CalendarMonthGridProps = CalendarHostProps<HTMLTableAttributes>;
export type CalendarMonthsProps = CalendarHostProps<HTMLAttributes<HTMLDivElement>>;
export type CalendarNavProps = CalendarHostProps<HTMLAttributes<HTMLElement>> & {
  nextMonth?: Date | undefined;
  onNextClick?: (event: MouseEvent) => void;
  onPreviousClick?: (event: MouseEvent) => void;
  previousMonth?: Date | undefined;
};
export type CalendarNavigationButtonProps = CalendarHostProps<HTMLButtonAttributes>;
export type CalendarOptionProps = Omit<HTMLOptionAttributes, "children"> & {
  children: Snippet;
  label: string;
};
export type CalendarRootComponentProps = CalendarHostProps<HTMLAttributes<HTMLDivElement>> & {
  rootRef?: Attachment<HTMLDivElement>;
};
export type CalendarSelectProps = CalendarHostProps<HTMLSelectAttributes>;
export type CalendarWeekProps = CalendarHostProps<HTMLAttributes<HTMLTableRowElement>> & {
  week: CalendarWeekModel;
};
export type CalendarWeekdayProps = CalendarHostProps<HTMLThAttributes> & { weekday: Date };
export type CalendarWeekdaysProps = CalendarHostProps<HTMLAttributes<HTMLTableRowElement>>;
export type CalendarWeekNumberHeaderProps = CalendarHostProps<HTMLThAttributes>;
export type CalendarWeeksProps = CalendarHostProps<HTMLAttributes<HTMLTableSectionElement>>;

export interface CalendarComponents {
  CaptionLabel?: Snippet<[CalendarCaptionLabelProps]>;
  Chevron?: Snippet<[CalendarChevronContext]>;
  Day?: Snippet<[CalendarDayProps]>;
  DayButton?: Snippet<[CalendarDayButtonProps]>;
  Dropdown?: Snippet<[CalendarDropdownContext]>;
  DropdownNav?: Snippet<[CalendarDropdownNavContext]>;
  Footer?: Snippet<[CalendarFooterProps]>;
  Month?: Snippet<[CalendarMonthProps]>;
  MonthCaption?: Snippet<[CalendarMonthCaptionProps]>;
  MonthGrid?: Snippet<[CalendarMonthGridProps]>;
  Months?: Snippet<[CalendarMonthsProps]>;
  MonthsDropdown?: Snippet<[CalendarDropdownContext]>;
  Nav?: Snippet<[CalendarNavProps]>;
  NextMonthButton?: Snippet<[CalendarNavigationButtonProps]>;
  Option?: Snippet<[CalendarOptionProps]>;
  PreviousMonthButton?: Snippet<[CalendarNavigationButtonProps]>;
  Root?: Snippet<[CalendarRootComponentProps]>;
  Select?: Snippet<[CalendarSelectProps]>;
  Week?: Snippet<[CalendarWeekProps]>;
  Weekday?: Snippet<[CalendarWeekdayProps]>;
  Weekdays?: Snippet<[CalendarWeekdaysProps]>;
  WeekNumber?: Snippet<[CalendarWeekNumberProps]>;
  WeekNumberHeader?: Snippet<[CalendarWeekNumberHeaderProps]>;
  Weeks?: Snippet<[CalendarWeeksProps]>;
  YearsDropdown?: Snippet<[CalendarDropdownContext]>;
}

export interface CalendarLabels {
  labelDayButton?: (date: Date, modifiers: CalendarModifiers) => string;
  /** @deprecated Use `labelDayButton`. */
  labelDay?: (date: Date, modifiers: CalendarModifiers) => string;
  labelGrid?: (month: Date, options: CalendarFormatterOptions) => string;
  labelGridcell?: (date: Date, modifiers: CalendarModifiers) => string;
  labelMonthDropdown?: (options: CalendarFormatterOptions) => string;
  labelNav?: () => string;
  labelNext?: (month: Date | undefined) => string;
  labelPrevious?: (month: Date | undefined) => string;
  labelWeekday?: (weekday: Date, options: CalendarFormatterOptions) => string;
  labelWeekNumber?: (weekNumber: number) => string;
  labelWeekNumberHeader?: () => string;
  labelYearDropdown?: (options: CalendarFormatterOptions) => string;
}

type CalendarRootProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "class" | "hidden" | "onkeydown" | "onselect" | "style"
>;

export type CalendarNumerals =
  | "arab"
  | "arabext"
  | "beng"
  | "deva"
  | "geez"
  | "gujr"
  | "guru"
  | "khmr"
  | "knda"
  | "laoo"
  | "latn"
  | "mlym"
  | "mymr"
  | "orya"
  | "tamldec"
  | "telu"
  | "thai"
  | "tibt";

export type CalendarStyle = HTMLAttributes<HTMLDivElement>["style"];
export type CalendarStyles = Record<string, CalendarStyle | undefined>;

interface CalendarBaseProps extends CalendarRootProps {
  animate?: boolean;
  autoFocus?: boolean;
  broadcastCalendar?: boolean;
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
  firstWeekContainsDate?: 1 | 4;
  footer?: Snippet | string;
  formatters?: CalendarFormatters;
  hidden?: DateMatcher | DateMatcher[];
  hideNavigation?: boolean;
  hideWeekdays?: boolean;
  ISOWeek?: boolean;
  labels?: CalendarLabels;
  locale?: CalendarLocale;
  maxDate?: Date;
  minDate?: Date;
  modifiers?: Record<string, DateMatcher | DateMatcher[] | undefined>;
  modifiersClassNames?: Record<string, string>;
  modifiersStyles?: CalendarStyles;
  month?: Date;
  navLayout?: "after" | "around";
  noonSafe?: boolean;
  numerals?: CalendarNumerals;
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
  style?: CalendarStyle;
  styles?: CalendarStyles;
  timeZone?: string;
  today?: Date;
  unavailable?: DateMatcher | DateMatcher[];
  weekNumber?: Snippet<[CalendarWeekNumberContext]>;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export type CalendarSelectEvent = KeyboardEvent | MouseEvent;

export interface CalendarSingleProps extends CalendarBaseProps {
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
