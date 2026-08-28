# Toggle Group port evidence

## source record

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Component: `reference/apps/ui/registry/default/ui/toggle-group.tsx`
- Documentation: `reference/apps/ui/content/docs/components/toggle-group.mdx`
- Particles read in full: `p-toggle-group-1.tsx` through `p-toggle-group-9.tsx`
- Other complete usages read: `p-calendar-19.tsx`, `p-tooltip-2.tsx`, `p-tooltip-3.tsx`, `p-toolbar-1.tsx`, and the Toggle Group usage in `content/docs/components/toolbar.mdx`
- Migration notes checked: the Toggle and Toggle Group sections in `content/docs/(root)/radix-migration.mdx`, plus the March 20, 2026 Toggle Group entry in `content/docs/(root)/changelog.mdx`
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Shards files read in full: `src/lib/components/toggle-group/context.ts`, `index.ts`, `toggle-group.svelte`, the 439-line Toggle Group test, all ten fixtures, `docs/src/content/toggle-group.md`, and both demos
- Installed `@shardsui/svelte@0.1.0-beta.0` Toggle Group source, context declarations, and generated component declarations were checked against the local source.

## COSS contract

The React module exports a root, item, separator, style context, and Base UI namespace. The root defaults to `variant="default"`, `size="default"`, and `orientation="horizontal"`. It writes `data-size`, `data-slot="toggle-group"`, and `data-variant`, then gives every item the root's size and variant.

The default variant uses a 2px gap. The outline variant removes the gaps, joins adjacent corners and borders, and uses explicit separators. Vertical outline groups switch to a column and apply the matching top and bottom edge rules. A focused child receives `z-index: 10` so its ring is not clipped by its siblings.

The COSS particles use array values for both single and multiple selection. `multiple` changes selection rules. The examples also cover responsive sizes, full-group disablement, one disabled item, vertical orientation, outline separators, and tooltip composition. The changelog reserves `Toggle` for the standalone component and names grouped controls `ToggleGroupItem`.

## Shards behavior

Shards uses `role="group"`, a bindable `value` array, `onValueChange`, and `data-disabled`, `data-multiple`, and `data-orientation`. It implements a single roving tab stop with disabled-item skipping. Horizontal arrows follow text direction. Vertical groups use Up and Down. Home and End move to the first and last enabled items. `loopFocus` defaults to true. When nested in a Shards Toolbar, the toolbar owns composite navigation and disabled state.

Shards uses `value` as the initial value for uncontrolled state. COSS particles use `defaultValue`. The port accepts both. `defaultValue` seeds the wrapper's bindable value only when the consumer does not supply `value`.

## rendered evidence

The live COSS page at `https://coss.com/ui/docs/components/toggle-group` was inspected in the Codex in-app Browser on August 27, 2026.

The default desktop group is 100px by 32px. It has three 32px square items and two 2px gaps. The small group is 88px by 28px. The large group is 112px by 36px. The horizontal outline group is 98px by 32px: three 32px buttons and two 1px separators, with 10px outer corners and square inner corners. The vertical outline group is 32px by 98px with the same measurements rotated.

Only one item starts with `tabindex="0"`; the others use `-1`. Right Arrow moved focus from Bold to Italic without changing selection. Space then selected Italic and cleared Bold in single mode. A horizontal group skipped a disabled Italic item and moved from Bold to Underline. Down Arrow moved from Bold to Italic in the vertical group. After the focus transition settled, the focused item had the COSS 1px background offset and 2px ring, and the group raised it to z-index 10.

Light and dark themes were checked. The wrapper keeps the COSS class strings, so the token-driven pressed, outline, hover, separator, and dark shadow treatments remain in CSS rather than component state.

## Svelte mapping

- `ToggleGroup.Root` wraps Shards `ToggleGroup` and supplies a typed Svelte context for style inheritance.
- `ToggleGroup.Item` wraps the local `Toggle`, inherits root size and variant, and keeps `pressed`, `ref`, `value`, native attributes, and callbacks transparent.
- `ToggleGroup.Separator` wraps the existing COSS Separator and preserves the upstream default vertical orientation.
- Compatibility aliases are `ToggleGroupRoot`, `ToggleGroupItem`, `ToggleGroupSeparator`, and `ToggleGroupPrimitive`.
- The Svelte namespace is static exports from `index.ts`. It does not use runtime object construction.
- Shards owns selection, roving focus, text direction, toolbar integration, disabled handling, and generated fallback values.

## verification and remaining dependency

- SSR and type coverage for every part and alias, exact group/item/separator classes, inherited style props, `value`, `defaultValue`, `multiple`, orientation, loop behavior, refs, callbacks, and snippets
- Browser coverage for single and multiple selection, binding, declined writes, disabled groups and items, horizontal and vertical roving focus, wrapping, Home and End, callback values, and hydration
- The parity fixture reproduces particles 1 through 8. Particle 9 composes Toggle Group with Tooltip; it must be added after the Tooltip port is available rather than replacing that dependency with a different primitive.
- Focused SSR, browser, and Playwright parity suites pass. Playwright covers exact connected geometry, responsive sizes, accessible names, pressed attributes, focus behavior, both themes, and axe.

## D5 documentation port

The D5 lane re-read the complete Toggle Group MDX page, particles `p-toggle-group-1` through `p-toggle-group-9`, the target namespace, and the complete matching local Shards source, tests, docs, and examples. The page keeps all nine preview IDs, their order, and the upstream Changelog section. The live page exposed 9 previews at 1440px; at 390px its h1 was x=16, y=88, 358×36 with no horizontal overflow. Particle 9 preserves the three accessible toggle labels and initial Bold selection; fully delegated Tooltip-trigger composition remains a Tooltip API seam. Shared page metadata remains coordinator-owned.
