# Empty port evidence

## Sources inspected

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/empty.tsx`
- Button source used by p-empty-1: `reference/apps/ui/registry/default/ui/button.tsx`
- Documentation: `reference/apps/ui/content/docs/components/empty.mdx`
- Importing particles: `reference/apps/ui/registry/default/particles/p-empty-1.tsx`, `p-card-11.tsx`, and `p-command-2.tsx`; `p-empty-1.tsx` was reopened immediately before correcting the preview
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Shards Button implementation and exports: `shardsui/packages/shardsui/src/lib/components/button/button.svelte` and `button/index.ts`
- Shards Button test: `shardsui/packages/shardsui/tests/button/button.test.ts`
- Shards Button documentation and example: `shardsui/docs/src/content/button.md` and `shardsui/docs/src/lib/components/content/demos/button/hero/demo.svelte`

Empty is native layout. The p-empty-1 controls use the public COSS for Svelte Button, which delegates button behavior to Shards.

## COSS contract

Exports are `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, and `EmptyContent`. Every static part renders a `div` with its COSS classes and `data-slot`. `EmptyMedia` supports `default` and `icon`. The icon variant renders two `aria-hidden` rotated background layers plus the foreground content layer, preserves `data-variant`, and keeps the source border, shadow, radius, and icon-size selectors.

The parity fixture is the complete p-empty-1 particle. It preserves the Route and Book icon paths, exact title and description, the `flex gap-2` action wrapper, and the Create meeting/View docs controls. Both buttons use COSS `size="sm"`; View docs uses the outline treatment.

## Svelte mapping and proof

- Children are snippets; native attributes, event callbacks, and refs are forwarded.
- A private zero-DOM part component keeps the five static wrappers consistent.
- The particle uses the public Button component without an extra DOM wrapper.
- The review shell centers the untouched particle and leaves its root at intrinsic width. It does not apply minimum height, padding, or width to the Empty root.
- Preview: `/preview/empty?theme=light&width=desktop`.
- Component tests: `packages/ui/src/components/ui/empty/*.test.ts`.
- Particle parity test: `tests/e2e/empty.spec.ts`.

## Rendered parity evidence

Automated headless comparison against `/ui/docs/components/empty` and the built Svelte preview produced the same p-empty-1 layout at 1200×800 and 390×844. The intrinsic root is 287.25×324 desktop and 311.609375×264 mobile. It retains a 24px root gap, 24px horizontal padding, and 80px desktop/48px mobile vertical padding.

Create meeting and View docs are 28px high desktop and 32px high mobile, with 10px radii, 9px inline padding, and weight 500. Their widths match the reference: 124.546875/106.703125 desktop and 138.03125/117.578125 mobile. The foreground media layer is 36px and the two rotated decorative layers remain `aria-hidden`.

The focused Playwright gate covers light and dark themes, both widths, exact hierarchy and copy, icon layers, treatment classes, geometry, Tab order, console errors, and axe.

The documentation API reference preserves all seven upstream code examples in order: `Empty`,
`EmptyHeader`, both `EmptyMedia` variants, `EmptyTitle`, `EmptyDescription`, and `EmptyContent`.
The Svelte translation uses the public `@coss-sv/ui` exports and the `Avatar.Root`, `Avatar.Image`,
and `Avatar.Fallback` namespace. Only the upstream icon example renders a Hugeicons glyph. The D4
test compiles every displayed Svelte fence and server-renders the authored page, then requires all
six API headings and seven highlighted example blocks.

## D4 documentation coverage

The page and `p-empty-1` preserve the upstream copy, action order, icon meaning, and layered media
layout. Route and Book icons use Hugeicons. The D4 inventory test locks metadata, source syntax,
icon authority, and preview order. The D4 route test opens the particle in light and dark at both
responsive widths, checks its deterministic links, and rejects browser errors and external
requests. The focused Empty Playwright gate covers axe.

Accepted component deviations: none.
