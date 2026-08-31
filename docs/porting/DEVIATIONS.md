# Port deviations

## Label checkbox preview identifier

- Component or page: Label documentation, “With Checkbox”.
- Upstream behavior: the page requests `checkbox-demo`, but no source with that identifier exists
  anywhere inside the permitted `reference/apps/ui/**` subtree.
- Port behavior: the page renders `p-checkbox-1`, whose permitted upstream source contains the
  exact documented `Label` and `Checkbox` composition.
- Reason: this repairs a dangling upstream identifier without inventing a 509th particle or using
  source outside the MIT-designated subtree.
- Approval: coordinator source-boundary decision on 2026-08-31.
- Evidence: `docs/porting/components/label.md` records the exhaustive source search, and
  `apps/ui/tests/docs/d6-form-inputs.test.ts` locks the corrected preview order and identifier.

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
