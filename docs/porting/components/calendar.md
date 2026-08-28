# Calendar port evidence

## Source baseline

- COSS reference commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Shards reference commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- COSS implementation: `reference/apps/ui/registry/default/ui/calendar.tsx`
- COSS documentation: `reference/apps/ui/content/docs/components/calendar.mdx` and `reference/apps/ui/content/docs/components/date-picker.mdx`
- COSS agent reference: `reference/apps/ui/skills/coss/references/primitives/calendar.md`
- Calendar particles: every file from `p-calendar-1.tsx` through `p-calendar-25.tsx`
- Date-picker particles: every file from `p-date-picker-1.tsx` through `p-date-picker-9.tsx`

Only the MIT-designated `reference/apps/ui/**` subtree was used. No source from
`reference/packages/ui/**` was opened or adapted.

## COSS contract

The wrapper is a styled React DayPicker. Its observable contract includes single,
multiple, and range selection; controlled and initial month/selection state; month and
year caption dropdowns; multiple and reversed months; fixed weeks; outside days; week
numbers; navigation limits; disabled and unavailable dates; selection minimums and
maximums; custom formatters, modifiers, day content, dropdowns, and week-number content;
locale and week-start control; and the DayPicker grid keyboard model.

The port preserves the COSS root, part, and state classes from `calendar.tsx`, including
the `--cell-size` contract and the `data-slot="calendar"` root. It uses the same visible
navigation labels, selected/range/today/outside/disabled states, and semantic calendar
table. Calendar navigation and dropdown controls use the COSS labels. Day buttons expose
full localized dates, one roving tab stop, native button activation, selected state, and
the Arrow, Home, End, Page Up, Page Down, and Shift+Page keyboard behavior.

The Calendar documentation lists a `buttonVariant` prop, but the pinned COSS component
does not declare or consume it and none of the 34 particles passes it. The implementation
source is authoritative, so the Svelte API does not invent this stale documentation prop.

## Particle coverage

The calendar particles cover the default calendar (`1`); fixed weeks (`2`); dropdown,
month-only, and year-only captions (`3`–`5`); custom native Select, Combobox, and searchable
caption controls (`6`–`13`); custom caption layout (`14`); single, multiple, and range
selection (`15`–`17`); multi-month range selection (`18`); outside days (`19`); disabled
dates (`20`); paged and reversed multi-month navigation (`21`–`22`); week numbers and a
custom week-number control (`23`); custom day content (`24`); and unavailable dates (`25`).

The date-picker particles cover a basic popover picker (`1`); range selection (`2`);
bounded dropdown navigation (`3`); preset ranges (`4`); text-input parsing (`5`–`6`);
close-on-select behavior (`7`); natural-language input (`8`); and month/year segments
(`9`). Date picker remains a composition of Calendar and Shards Popover, Field, and Input;
it is not a separate package primitive.

## Shards inspection and Svelte design

Shards has no Calendar primitive. The inspection therefore covered the complete local
Popover, Field, and Input implementations, their documentation, tests, examples, and
exported types. `Input` resolves to Field's `field-control.svelte`. The internal Composite
and Button implementations were also read to verify Shards' focus and native-button
conventions.

Calendar is implemented as a Svelte 5 component rather than importing another calendar
architecture. Shards Popover supplies modal positioning, dismissal, and trigger focus
restoration for date-picker compositions. Field and Input supply the text-entry and form
contracts used by the COSS date-picker particles. Calendar keeps its own semantic grid and
roving focus because Shards does not expose a calendar or a public composite-grid primitive.

The Svelte API uses bindable `month`, `selected`, and `ref` values plus `onMonthChange`,
`onSelect`, and `onDayClick` callbacks. React component overrides become typed snippets for
day, dropdown, and week-number content. `class` is the primary root-class prop, with
`className` retained as a migration alias. The locale prop is a BCP 47 locale string used by
`Intl.DateTimeFormat`; dates remain local `Date` objects normalized at noon to avoid DST
date drift.

Navigation uses `ArrowLeft01Icon`, `ArrowRight01Icon`, and `ArrowUpDownIcon` from the
approved Hugeicons packages. No Lucide dependency, copied Lucide path, hand-drawn SVG, or
additional calendar runtime dependency was added.

## Documentation lookup

Context7 resolved the current Bits UI documentation as `/websites/bits-ui`, then rejected
the documentation query because the monthly quota was exhausted. The same quota blocked
the shadcn-svelte lookup. Local installed declarations, the complete local Shards source,
and official primary documentation were used only as fallback contract checks. Neither
Bits UI nor shadcn-svelte supplied this component's architecture; COSS and local Shards are
the authorities.

## Verification coverage

- `calendar.test.ts` covers six-week generation, every matcher shape used by COSS,
  single/multiple/range minimum and maximum selection rules, exact class and slot output,
  formatters, multi-month rendering, outside-day hiding, week numbers, caption dropdowns,
  custom day content, locale, week start, and navigation bounds.
- `calendar.browser.test.ts` covers live single/multiple/range selection, unavailable and
  disabled days, range state, Arrow/Home/End/Page/Shift+Page focus movement, disabled-day
  skipping, button navigation, month/year dropdown changes, and focus restoration after a
  Calendar selection closes a real Shards Popover.
- `calendar.browser-fixture.svelte` is package-owned test-only composition evidence. It is
  not a documentation example or registry entry.

The COSS Calendar and Date Picker pages were also inspected in the Codex in-app Browser on
2026-08-28. The live default Calendar rendered a 252-by-264-pixel six-row grid at the
reference viewport, 36-pixel day buttons, a 10-pixel selected-day radius, Sunday-first
weekday labels, one `tabindex="0"` day, and the expected foreground/background selection
pair. Arrow-key movement transferred the roving tab stop. In the close-on-select Date
Picker example, choosing a day removed the Popover and returned focus to the updated
trigger. No Chrome session or connector was used.

The documentation preview and public registry entry are coordinator-owned integration work
and are intentionally outside this lane. There are no accepted visual, behavioral,
accessibility, or licensing deviations in the package component.
