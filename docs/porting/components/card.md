# Card port evidence

## Sources inspected

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/card.tsx`
- Documentation: `reference/apps/ui/content/docs/components/card.mdx`
- Particles: `reference/apps/ui/registry/default/particles/p-card-1.tsx` through `p-card-11.tsx`, plus `p-table-6.tsx`, `p-table-7.tsx`, and `p-table-8.tsx`; `p-card-1.tsx` and `p-card-11.tsx` were reopened immediately before correcting the preview
- Direct dependencies used by p-card-1 and p-card-11: `reference/apps/ui/registry/default/ui/button.tsx`, `field.tsx`, `form.tsx`, `input.tsx`, `select.tsx`, and `empty.tsx`
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Complete Shards Button source, export, test, documentation, and hero example under `shardsui/packages/shardsui/src/lib/components/button/`, `shardsui/packages/shardsui/tests/button/`, `shardsui/docs/src/content/button.md`, and `shardsui/docs/src/lib/components/content/demos/button/hero/demo.svelte`
- Shards Select implementation and exports: every file under `shardsui/packages/shardsui/src/lib/components/select/`
- Shards Select tests: the root and trigger coverage under `shardsui/packages/shardsui/tests/select/`
- Shards Select documentation and examples: `shardsui/docs/src/content/select.md`, its hero demo, and the basic Select fixture

Card is native layout. All 11 particles use the published COSS for Svelte Button, Card, Empty,
Field, Form, Frame, Input, and Select APIs. Select delegates behavior to the pinned Shards
implementation.

## COSS contract

The port includes `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardPanel`, `CardContent`, `CardFooter`, `CardFrame`, `CardFrameHeader`, `CardFrameTitle`, `CardFrameDescription`, `CardFrameAction`, and `CardFrameFooter`. `CardContent` is the same component value as `CardPanel`.

Every part defaults to `div`, supports polymorphic rendering, keeps its `data-slot`, and preserves the complete source class string. This includes frame clipping variables, nested-card selectors, table-container selectors, pseudo-element highlights, and conditional panel/header/footer spacing.

The parity fixture maps two upstream particles without hybrid copy:

- p-card-1: Create project header and description; Name input; Framework Select with Next.js, Vite, Remix, and Astro; Deploy submit button; and the exact completion notice.
- p-card-11: Project frame header and description; outline Add button; nested Card/Panel/Empty hierarchy; and the exact “No projects yet” copy.

## Svelte mapping and proof

- Base UI `render` becomes an explicit `as` prop on production Card parts.
- A private zero-DOM `CardPart` component centralizes class merging, snippet rendering, native prop forwarding, and bindable refs.
- The Select particles use `Select.Root`, `Select.Trigger`, `Select.Value`, `Select.Popup`, and
  `Select.Item` from `@coss-sv/ui`. No particle imports Shards source or package internals.
- The p-card-11 preview uses production Empty inside the nested production Card.
- Buttons use the public COSS for Svelte Button component and add no wrapper.
- Preview: `/preview/card?theme=light&width=desktop`.
- Component tests: `packages/ui/src/components/ui/card/*.test.ts`.
- Particle parity test: `tests/e2e/card.spec.ts`.

## Rendered parity evidence

Automated headless comparison used the running pinned React card docs for p-card-1, the pinned particle gallery filtered to Card/Frame for p-card-11, and the built Svelte preview. At 1200×800 and 390×844:

- p-card-1 matches at 320×318 desktop and 308×334 mobile. Its Input is 30px/34px high, Select trigger 32px/36px, and Deploy button 32px/36px.
- p-card-11 matches at 498×394 desktop and 308×350 mobile. Its nested Card has the same width as the frame; Add is 32px/36px high.
- Card and CardFrame keep a 16px outer radius. Deploy uses the primary treatment; Add uses the outline treatment.

The keyboard test follows Name → Framework, opens the Shards Select with ArrowDown, verifies all four options, moves focus from Next.js to Vite, commits with Enter, then continues to Deploy and Add. The focused Playwright gate covers light and dark themes, both widths, exact hierarchy and copy, geometry, console errors, and axe.

The pinned rendered docs compute the dark background and popover mixes at 96%. The MIT registry metadata in `reference/apps/ui/registry/registry-styles.ts` and styling prose are stale at 95% background and 98% popover. The preview follows the rendered parity authority.

## D4 documentation coverage

The documentation lane freshly read `p-card-1.tsx` through `p-card-11.tsx`, the Card page, every
direct dependency used by those particles, the complete local Shards Select source, docs, tests,
examples, and the published COSS for Svelte Select wrappers. The Svelte particles preserve the
source copy, framework option order, form structure, surface nesting, responsive classes, and all
11 registry titles. `p-card-1` and `p-card-4` through `p-card-10` use the public Select namespace.
Every UI icon uses Hugeicons.

`apps/ui/tests/docs/d4-card-particles.test.ts` renders all eight Select-dependent particles on the
server and checks copy, controls, structure, option order, public imports, and displayed source.
`tests/e2e/d4-disclosure-docs.spec.ts` opens every Card particle in the required themes and widths,
checks deterministic source and install links, rejects console and external-resource failures, and
exercises Select by keyboard. The focused `tests/e2e/card.spec.ts` gate covers axe.

The D4 implementation session could not complete a local in-app Browser pass because its selected
Browser binding returned unavailable. The coordinator and both exact-tip reviewers must repeat the
manual source-versus-target comparison; this record does not claim that pass as completed.

Accepted component deviations: none.

## Central Hugeicons renderer migration

The p-card-1, p-card-3, p-card-4, p-card-6, p-card-7, p-card-8, p-card-10, and p-card-11 registry sources keep their audited Hugeicons core glyph data, two-pixel strokes, classes, and ARIA attributes. They now render that data with the public SSR-safe HugeiconsIcon exported by @coss-sv/ui. The focused ownership test enumerates each migrated particle, rejects the framework-specific renderer, checks every icon invocation, and verifies server-rendered SVG geometry.
