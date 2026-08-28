# Calendar port evidence

## Source baseline

- COSS reference commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Shards reference commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- COSS component: `reference/apps/ui/registry/default/ui/calendar.tsx`
- COSS pages: `reference/apps/ui/content/docs/components/calendar.mdx` and `date-picker.mdx`
- COSS particles: `p-calendar-1.tsx` through `p-calendar-25.tsx`, plus
  `p-date-picker-1.tsx` through `p-date-picker-9.tsx`
- Exact upstream adapter source: the nested React DayPicker 10.0.1 installed under
  `reference/node_modules/@daypicker/react/node_modules/react-day-picker`

The COSS files under `reference/apps/ui/**` are the only COSS source used here. No file
under `reference/packages/ui/**` was opened or adapted.

## Contract taken from COSS and DayPicker 10

COSS wraps DayPicker 10 and supplies its own classes and Chevron components. The Svelte
port keeps the same root, part, modifier, and range classes. It also restores DayPicker's
unmodified `rdp-*` classes for root, month grid, weekday rows, week rows, selected days,
and the other parts that COSS does not replace.

`CalendarProps` is a union keyed by `mode` and `required`. Single, multiple, and range
callbacks receive the selected value, trigger date, modifier record, and original event.
Invalid mode and selection combinations fail the type test. Range-only props such as
`excludeDisabled` and `resetOnSelect` cannot be passed to another mode.

The component accepts every matcher form used by COSS, plus DayPicker's boolean matcher
and scalar `dayOfWeek`. Forward intervals match their open interior; reversed intervals
match dates outside both open boundaries. Selection covers required and optional single,
multiple, and range modes. The multiple maximum resets to the clicked date as DayPicker
does. Range selection implements `min`, `max`, `excludeDisabled`, and the distinct
`resetOnSelect` path.

Day buttons and week numbers are full host replacements. `components.DayButton` receives
the day model, all modifiers, children, native button attributes, and event handlers.
`components.WeekNumber` receives the week model, children, and native `th` attributes. The
price calendar in particle 24 and custom week number in particle 12 can therefore use the
same composition pattern as the COSS files without nested buttons or table headers.

The DOM follows the live DayPicker structure. The root has `lang` and mode data attributes.
Captions use a polite status region. Weekday headers expose full weekday names and their
`thead` is hidden from the accessibility tree. The table, rows, cells, day buttons, and
week-number cells retain their COSS and DayPicker roles, labels, data attributes, and
classes.

## Particle inventory

The calendar particles cover these cases:

- 1 to 3: default single selection, larger cells, and range selection
- 4 to 6: native dropdowns, a custom Select, and a custom Combobox
- 7 and 8: disabled range matchers with `excludeDisabled`, then multiple selection
- 9 to 11: round cells, custom range styling, and right-aligned navigation
- 12 to 14: a replacement week-number cell, a year Combobox, and replacement dropdown navigation
- 15 to 17: controlled month, a Today action, and a linked date input
- 18 to 21: time input, appointment slots, single-date presets, and range presets
- 22 and 23: paged two-month and three-month ranges
- 24: replacement price day buttons
- 25: calendar selection composed with a time autocomplete

The date-picker particles cover a single picker, range picker, dropdown picker, presets,
a linked date input, close on select, multiple-date badges, a Select-style trigger, and a
two-month range picker. Date Picker remains a Calendar and Shards Popover composition.

## Shards and Svelte design

Shards has no calendar component. The local Popover root, trigger, popup, focus manager,
tests, and examples were read in full. Shards restores focus to the active trigger when a
picker closes. Calendar owns the grid because Shards exposes no public calendar grid part.

The implementation uses Svelte 5 runes, snippets, callback props, typed native attributes,
and declaration tags. Day and week replacement snippets receive the actual host contract.
There are no React event shims, legacy Svelte events, slots, or module-level mutable date
state.

`locale` accepts a locale object with `code` and date-fns-compatible week options. The
component uses the locale code for `Intl.DateTimeFormat` and reads the locale's default
week start. `timeZone` maps input instants to calendar days in that IANA zone. `noonSafe`
keeps internal dates at noon for historical offset and DST cases. The default current day
is created per component instance, while `today` gives SSR callers a fixed value. Internal
calendar math never converts the same zoned day twice.

The month and year dropdown handlers use the chronological offset between each caption
month and the first displayed month. This keeps cross-year, multi-month, and
`reverseMonths` changes anchored to the caption the user changed.

Selection is controlled whenever `onSelect` is present, including when `selected` is
undefined. Any supplied `month` is controlled whether or not `onMonthChange` is present.
Callbacks report proposed values while ignored parent values remain rendered. Adding or
removing either control input updates the mode without remounting. In the Svelte two-way
form, values emitted through `bind:selected` or `bind:month` remain canonical calendar
dates and are not converted through the IANA zone a second time. `defaultSelected` and
`defaultMonth` remain internal state, including across hydration when their corresponding
control input is absent.

Roving focus only targets visible, enabled days. A disabled selected date falls back to the
first enabled day. Month changes and externally controlled months recompute the target;
controlled months outside the navigation bounds render at the nearest allowed month. If
keyboard navigation cannot find another enabled date within the bounds, focus stays on the
existing enabled button. Arrow, Shift+Arrow, Home, End, Page Up, Page Down, and Shift+Page
follow the DayPicker 10 movement units when they skip disabled dates. Month and year
movement preserves the day number when the target month contains it and clamps only at the
target month's end.

Calendar uses `ArrowLeft01Icon`, `ArrowRight01Icon`, and `ArrowUpDownIcon` from the approved
Hugeicons packages. It adds no calendar runtime dependency.

## Documentation lookup

Context7 resolved the relevant current library entry, but its documentation query stopped
at the monthly quota. The implementation therefore used the installed DayPicker 10.0.1
source and types, plus the complete local Shards source. Shadcn Svelte did not determine
the architecture or dependency choice.

## Tests

- `calendar.types.test.ts` checks the mode and required union, callback arguments, rejected
  combinations, and full DayButton and WeekNumber replacement props.
- `calendar.test.ts` checks matcher forms, selection rules, `resetOnSelect`, time-zone day
  conversion, canonical existing selections at the `Etc/GMT+12` and
  `Pacific/Kiritimati` boundaries, noon-safe values returned by every selection mode,
  date-preserving month movement, per-instance current dates, a controlled `today`, COSS
  and `rdp-*` classes, locale objects, and SSR output.
- `calendar.browser.test.ts` checks all selection modes, callback data, disabled and
  unavailable dates, the full keyboard model, enabled roving focus, navigation exhaustion,
  controlled and bound state, live control-mode transitions, controlled undefined
  selection, month control without a callback, GMT-12 and GMT+14 noon-safe callback and
  bound values, externally controlled month bounds, native dropdowns, cross-year reversed
  months, replacement hosts, and Shards Popover focus restoration.
- The browser suite hydrates actual Calendar SSR HTML under a frozen clock at a UTC to Los
  Angeles date boundary. It verifies that `defaultSelected` survives hydration. The
  compressed fixture records the server render used by that regression and avoids adding a
  shared Vitest command outside this lane.

Documentation pages, registry entries, and aggregate exports remain coordinator work.
