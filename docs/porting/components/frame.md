# Frame port evidence

## Sources inspected

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/frame.tsx`
- Documentation: `reference/apps/ui/content/docs/components/frame.mdx`
- Frame particles: `reference/apps/ui/registry/default/particles/p-frame-1.tsx` through `p-frame-4.tsx`
- Other direct consumers: `p-card-8.tsx`, `p-card-9.tsx`, `p-card-10.tsx`, `p-table-2.tsx`, `p-table-3.tsx`, and `p-table-4.tsx` in `reference/apps/ui/registry/default/particles/`
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Closest Shards source: every file under `shardsui/packages/shardsui/src/lib/components/field/` and `shardsui/packages/shardsui/src/lib/components/separator/`
- Shards tests: `field-root.test.ts`, `field-label.test.ts`, `field-description.test.ts`, the `full-field.svelte` fixture, and the complete Separator test under `shardsui/packages/shardsui/tests/`
- Shards documentation and examples: `shardsui/docs/src/content/field.md`, `shardsui/docs/src/content/separator.md`, and both hero demos

## COSS contract

Frame exports `Frame`, `FramePanel`, `FrameHeader`, `FrameTitle`, `FrameDescription`, and `FrameFooter`. The root, panel, title, and description are divs; header and footer keep their semantic tags. Every part preserves its source `data-slot`, exact utility string, native attribute and callback forwarding, snippet children, class precedence, and ref.

The root provides a muted four-pixel frame and a four-pixel gap only between adjacent panels. The panel keeps the one-pixel theme border, 20 pixel padding, source light/dark edge shadows, background clipping, and 14 pixel COSS radius. Header and footer use 16 by 20 pixel padding. Title and description stay at 14 pixels with a 20 pixel line height.

Shards Field and Separator were checked for an existing structural primitive. Their validation context and separator semantics do not match this purely visual container. Wrapping either would add state or DOM that COSS does not expose, so Frame remains a set of typed native Svelte elements.

## Browser evidence

Reference: `http://127.0.0.1:4000/ui/docs/components/frame`

Svelte: `http://127.0.0.1:5102/preview/frame?theme=<light|dark>&width=<mobile|desktop>`

The in-app Browser comparison covered the primary particle at 1200 by 800 and 390 by 844. The untouched `Frame class="w-full"` root measures 686 by 214 pixels on desktop and 308 by 214 pixels on mobile. Its panel measures 678 or 300 pixels after the root's four-pixel padding on each side. A separate neutral shell supplies those two available widths; it does not cap or pad the particle itself. Internal geometry matched: root radius 16 pixels and padding 4 pixels, header/footer padding 16 by 20, panel border 1 pixel, panel radius 14 pixels, and panel padding 20 pixels. Dark computed colors matched the reference's near-black background, 6% white border, and `rgb(129, 129, 129)` muted copy. Light uses the reference color-mix token and 8% black border. The rendered visual, including the inset panel edge and stacked spacing, was compared side by side in the in-app Browser. Both pages had empty error and warning logs.

The exact upstream dark muted foreground on the translucent muted frame fails axe's `color-contrast` rule for the 14 pixel description and footer. The parity test asserts that exact `rgb(129, 129, 129)` color, disables only `color-contrast` in dark mode, and requires zero violations from every other axe rule. Light mode runs the full axe ruleset. This is an upstream parity issue, not a hidden target-only exception.

## Test coverage

- red-first SSR tests for all six exports, tags, slots, exact class fragments, consumer class merging, and panel edge utilities;
- type tests for snippets, callbacks, native attributes, and refs;
- browser callback/ref and hydration tests;
- Playwright light/dark and desktop/mobile geometry, computed colors, border and shadow contract, axe, and console coverage.

Accepted deviations: none.

## D4 documentation coverage

The page preserves the two upstream previews in order. D4 owns `p-frame-1` through `p-frame-4` and
keeps the source copy, nested disclosure, footer actions, and separator composition. `p-frame-2`
uses Hugeicons for its Chevron and Trash controls. The D4 inventory test locks metadata and page
order. The D4 route test opens all four particles in light and dark, uses the mobile width for the
responsive particles, and rejects console errors and external requests. The focused Frame
Playwright gate covers axe, including its documented upstream dark contrast exception.

## Central Hugeicons renderer migration

The p-frame-2 registry sources keep their audited Hugeicons core glyph data, two-pixel strokes, classes, and ARIA attributes. They now render that data with the public SSR-safe HugeiconsIcon exported by @coss-sv/ui. The focused ownership test enumerates each migrated particle, rejects the framework-specific renderer, checks every icon invocation, and verifies server-rendered SVG geometry.
