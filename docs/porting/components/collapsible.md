# Collapsible port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/collapsible.tsx`
- `reference/apps/ui/content/docs/components/collapsible.mdx`
- `reference/apps/ui/registry/default/particles/p-collapsible-1.tsx`
- `reference/apps/ui/registry/default/particles/p-frame-2.tsx`

The dedicated particle shows recovery keys and rotates its chevron from `data-panel-open`. `p-frame-2` uses a Collapsible inside Frame and renders its trigger through Button in React. The `apps/ui` subtree has no Collapsible test file.

## Shards files inspected

The inspection covered every file under `shardsui/packages/shardsui/src/lib/components/collapsible/`, the Collapsible documentation and demo, all three Collapsible test files, and their fixtures. The installed `0.1.0-beta.0` declarations were checked against the local source.

The delegate translation also follows the local typed ref-box and prop-delegation convention in `packages/ui/src/components/ui/pagination/pagination-link.svelte`, including its SSR, type, browser, callback, and teardown coverage.

Shards owns bindable open state, disabled behavior, ARIA relationships, `hidden="until-found"`, mounted panels, transition status, and measured height and width variables.

## Translation decisions

- The public parts are `Collapsible.Root`, `Collapsible.Trigger`, and `Collapsible.Panel`.
- `defaultOpen` initializes the bindable Shards `open` value once. Later default prop changes do not replace uncontrolled state.
- The panel keeps the exact COSS height transition classes and data slots.
- `CollapsibleContent` remains an alias for `CollapsiblePanel`.
- `Collapsible.Trigger` exposes a typed `delegate` snippet for the React `render={<Button />}` case. The delegate receives Collapsible-owned state, ARIA attributes, content, callbacks, and a teardown-safe ref box. The rendered Button remains the single DOM trigger and owns its native button semantics and COSS variant styling.
- Delegated `aria-controls` comes from the Panel attachment. It follows an explicit Panel `id`, disappears when that Panel unmounts, and returns when it remounts; the Root does not invent a panel id.
- Disabled delegated triggers preserve Shards' `focusableWhenDisabled` behavior: they remain tabbable, expose `aria-disabled`, omit native `disabled`, and suppress pointer, Enter, Space, callback, and state changes.
- Delegated callbacks run before the internal toggle and may call `preventShardsUIHandler()` to cancel it, matching Shards' `chain()` contract.
- The hydration fixture uses byte-for-byte server output from the current provider boundary. Its SSR test guards the fixture string and its browser test hydrates that exact markup without warnings before the Panel attachment restores `aria-controls`.

## D4 documentation coverage

The Svelte page and `p-collapsible-1` preserve the upstream recovery-key copy, order, classes, and
Chevron meaning through Hugeicons. `p-frame-2` keeps the same nested Collapsible composition.
`apps/ui/tests/docs/d4-disclosure.test.ts` locks metadata, source syntax, icon authority, and preview
order. `tests/e2e/d4-disclosure-docs.spec.ts` checks both disclosure routes and exercises the
Collapsible with Space.

## Central Hugeicons renderer migration

The p-collapsible-1 registry sources keep their audited Hugeicons core glyph data, two-pixel strokes, classes, and ARIA attributes. They now render that data with the public SSR-safe HugeiconsIcon exported by @coss-sv/ui. The focused ownership test enumerates each migrated particle, rejects the framework-specific renderer, checks every icon invocation, and verifies server-rendered SVG geometry.
