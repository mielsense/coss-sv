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

## Entry format

Each proposed deviation must record:

- component or page;
- upstream behavior;
- port behavior;
- reason;
- user approval;
- tests and review evidence.

The documentation chrome's Svelte-orange primary color is an explicit product requirement, not a component-library deviation. It must remain scoped away from installable COSS component tokens.
