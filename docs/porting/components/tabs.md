# Tabs port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/tabs.tsx`
- `reference/apps/ui/registry/default/lib/segmented-control.ts`
- `reference/apps/ui/content/docs/components/tabs.mdx`
- `reference/apps/ui/registry/default/particles/p-tabs-1.tsx` through `p-tabs-15.tsx`

The particles cover default, underline, vertical, vertical underline, pill radius, icons, icon labels, icon-only controls, stacked icons, badges, a vertical navigation layout, small and large sizes, and tooltips. The `apps/ui` subtree has no Tabs test file.

## Shards files inspected

The inspection covered every file under `shardsui/packages/shardsui/src/lib/components/tabs/`, both Tabs demos, the full Tabs documentation, all five Tabs test files, and their fixtures. The installed `0.1.0-beta.0` declarations were checked against the local source.

Shards owns bindable selection, controlled and uncontrolled state, horizontal and vertical roving focus, manual and focus activation, disabled tabs, ARIA links, panel mounting, activation direction, transition state, and indicator geometry.

## Translation decisions

- The Svelte API uses `Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Indicator`, and `Tabs.Panel`.
- `Tabs.List` inserts the styled indicator automatically, matching the COSS component contract. The exported Indicator remains available for direct use.
- A typed Svelte context carries list size and variant to Tabs and Indicator wrappers.
- The default, small, and large item classes come directly from the MIT-designated segmented-control file.
- `defaultValue` initializes the bindable Shards value once. Later default prop changes do not replace uncontrolled state. `TabsTrigger` and `TabsContent` remain compatibility aliases.
- The wrapper keeps Shards `keepMounted`, `activateOnFocus`, `loopFocus`, link rendering, activation direction, and indicator CSS variables available.

## D4 documentation coverage

The lane owns `p-tabs-2` through `p-tabs-15`. It freshly read all 15 upstream particles because the
Tabs page also consumes D9-owned `p-tabs-1`. The 14 owned Svelte particles preserve the upstream
copy, order, variants, sizes, orientation, badges, icons, panels, and registry titles. Every UI icon
uses Hugeicons. The page keeps `p-tabs-1` as its primary preview and the route stays pending until D9
lands that particle.

`p-tabs-13` uses the approved DOM-only deviation recorded in `docs/porting/DEVIATIONS.md`. Its
semantic-neutral Tooltip Trigger spans have the same boxes as their child Tabs Tabs. Public Tooltip
handles restore focus and blur behavior while Shards continues to own hover, registration,
positioning, and dismissal. The wrappers do not add tab stops or roles.

`apps/ui/tests/docs/d4-disclosure.test.ts` locks D4 ownership, page preview order, Hugeicons imports,
and the D9 seam. `tests/e2e/d4-disclosure-docs.spec.ts` checks every owned particle route, plus Tabs
roving focus, activation, tooltip focus and hover, accessible names, wrapper geometry, list gaps,
growth, themes, and responsive layout.
