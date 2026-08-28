# Port deviations

## Calendar month control marker

- Component: Calendar.
- Upstream behavior: React DayPicker treats a supplied `month` prop as controlled, with
  or without `onMonthChange`.
- Port behavior: the Svelte Calendar treats `month` as controlled when `onMonthChange` is
  present. A callback-free `bind:month` is two-way. A bare `month={value}` without the
  callback can navigate locally.
- Reason: supported Svelte component APIs do not expose whether a `$bindable` prop is
  bound. Treating every defined `month` as controlled prevents ordinary callback-free
  bindings from updating their parent.
- Approval: coordinator decision for CAL-CONTROL-01 on 2026-08-28. The coordinator
  rejected private compiler and runtime introspection.
- Evidence: `calendar.browser.test.ts` covers callback-free binding, ignored controlled
  changes, and adding or removing the callback without remounting. The focused Calendar
  browser suite is required in both implementation and independent review.

## Tabs particle 13 tooltip trigger wrapper

- Component or page: `p-tabs-13`, "Tabs with icon only and grouped tooltips".
- Upstream behavior: Base UI merges Tooltip Trigger and Tabs Tab behavior onto one button through
  React's `render` prop.
- Port behavior: each Tabs Tab stays the only focusable control and sits inside a semantic-neutral
  `span` registered as the Shards tooltip anchor. Focus and blur call the public Tooltip handle;
  hover remains owned by Shards.
- Reason: Shards Tooltip Trigger renders its own element and exposes only state to its child
  snippet. It has no delegation attachment that can merge its private registration, hover, focus,
  and floating bindings onto Tabs Tab. `display: contents` would remove a stable positioning box,
  while nesting a Tooltip button around the Tabs button would create invalid interactive markup.
- Approval: the coordinator approved this DOM-only deviation on 2026-08-28. Visible layout,
  keyboard behavior, accessible names, and tooltip behavior still require parity.
- Evidence: `tests/e2e/d4-disclosure-docs.spec.ts` checks wrapper and tab geometry, list gaps,
  focus and hover tooltips, roving focus, activation, accessible names, theme, and responsive
  layout. `docs/porting/components/tabs.md` records the source inspection and comparison.

## Entry format

Each proposed deviation must record:

- component or page;
- upstream behavior;
- port behavior;
- reason;
- user approval;
- tests and review evidence.

The documentation chrome's Svelte-orange primary color is an explicit product requirement, not a component-library deviation. It must remain scoped away from installable COSS component tokens.
