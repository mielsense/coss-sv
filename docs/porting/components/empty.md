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

Empty is native layout. The p-empty-1 controls use Shards Button for button behavior, with exact COSS Button classes supplied by the dependency-gated preview helper until Button enters the production package.

## COSS contract

Exports are `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, and `EmptyContent`. Every static part renders a `div` with its COSS classes and `data-slot`. `EmptyMedia` supports `default` and `icon`. The icon variant renders two `aria-hidden` rotated background layers plus the foreground content layer, preserves `data-variant`, and keeps the source border, shadow, radius, and icon-size selectors.

The parity fixture is the complete p-empty-1 particle. It preserves the Route and Book icon paths, exact title and description, the `flex gap-2` action wrapper, and the Create meeting/View docs controls. Both buttons use COSS `size="sm"`; View docs uses the outline treatment.

## Svelte mapping and proof

- Children are snippets; native attributes, event callbacks, and refs are forwarded.
- A private zero-DOM part component keeps the five static wrappers consistent.
- The preview helper uses Shards Button without an extra DOM wrapper and uses Tailwind merge semantics for the COSS class variants.
- The review shell centers the untouched particle and leaves its root at intrinsic width. It does not apply minimum height, padding, or width to the Empty root.
- Preview: `/preview/empty?theme=light&width=desktop`.
- Component tests: `packages/ui/src/components/ui/empty/*.test.ts`.
- Particle parity test: `tests/e2e/empty.spec.ts`.

## Rendered parity evidence

Automated headless comparison against `/ui/docs/components/empty` and the built Svelte preview produced the same p-empty-1 layout at 1200×800 and 390×844. The intrinsic root is 287.25×324 desktop and 311.609375×264 mobile. It retains a 24px root gap, 24px horizontal padding, and 80px desktop/48px mobile vertical padding.

Create meeting and View docs are 28px high desktop and 32px high mobile, with 10px radii, 9px inline padding, and weight 500. Their widths match the reference: 124.546875/106.703125 desktop and 138.03125/117.578125 mobile. The foreground media layer is 36px and the two rotated decorative layers remain `aria-hidden`.

The focused Playwright gate covers light and dark themes, both widths, exact hierarchy and copy, icon layers, treatment classes, geometry, Tab order, console errors, and axe.

The Codex in-app Browser was requested for the manual comparison on 2026-08-27, but the runtime reported no available in-app Browser surface. No manual Browser claim is recorded; manual light/dark visual review remains an integration check.

Accepted component deviations: none.
