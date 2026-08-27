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

`p-tabs-13` is gated on Tooltip. All other Tabs particles can be ported after the docs lane adds the matching icons and already ported Badge.
