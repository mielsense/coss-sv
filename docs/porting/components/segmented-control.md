# Segmented Control documentation evidence

## Sources inspected

- Pinned COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Documentation: `reference/apps/ui/content/docs/components/segmented-control.mdx`
- Particles: `p-navigation-1.tsx` through `p-navigation-3.tsx`, `p-radio-group-7.tsx` through
  `p-radio-group-9.tsx`, and `p-tabs-1.tsx`
- COSS helper: `reference/apps/ui/registry/default/lib/segmented-control.ts`
- Every permitted particle consumer and the matching Radio Group and Tabs documentation
- Pinned Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Complete Radio, Radio Group, and Tabs component directories, exports, documentation, examples,
  fixtures, tests, and installed declarations

All COSS evidence came from the MIT-designated `reference/apps/ui/**` subtree. No source under
`reference/packages/ui/**` was used.

## Port contract

Segmented Control remains a styling pattern rather than a new behavioral component. Navigation uses
native links and `aria-current="page"`. Radio options use Shards' raw Radio Group and Radio
primitives. Tabs keep the library's indicator, panels, roving focus, and activation behavior. All
three presentations share the typed helper from `@coss-sv/ui/lib/segmented-control`.

The page preserves the upstream primary preview, explanation, primitive-selection table,
installation matrix, shared-helper API, option table, sizing guidance, section order, visible copy,
and eight-preview sequence. React CLI commands and imports become pnpm, shadcn-svelte, and typed
Svelte examples. Internal links use this documentation site's `/docs/components/*` routes.

The three navigation particles keep the exact project-section label, destinations, active link,
copy, and small/default/large sizes. The three Radio Group particles keep the exact billing-period
label, monthly default, option values, copy, growth, and sizes. The helper classes are imported once;
no particle duplicates the class recipe.

## Verification

The focused D9 suite locks the 64-item ownership inventory, dependency metadata, exact page preview
order, MDsveX compilation, SSR for every particle, the shared-helper import, and absence of copied
helper classes, React, Lucide, inline SVG, and legacy Svelte syntax. The docs Svelte check and
production build cover the route. Manual light, dark, responsive, focus, keyboard, and motion
comparison remains for the coordinator because the Codex in-app Browser was unavailable in this
task; Chrome was not used.

The coordinator-owned registry item for each of these six particles must include
`local:segmented-control`. This lane does not edit the aggregate registry manifest.

The package helper now accepts a cva-compatible `className?: ClassValue` option and merges it after
the shared size and state recipes through `clsx`. The three Radio Group particles pass the source's
`grow` class through that option instead of wrapping the helper with a second class merge. A focused
unit test covers nested arrays and conditional class objects as well as the exact COSS size and state
classes.
