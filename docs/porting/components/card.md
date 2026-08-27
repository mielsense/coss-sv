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

Card is native layout. The corrected preview uses the production Card, Input, and Empty ports. Button, Form, Field, and Select are dependency-gated: Shards Button and Select provide behavior, while native `form`, `div`, and `label` elements preserve the rendered Form/Field hierarchy until those production ports are integrated.

## COSS contract

The port includes `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardPanel`, `CardContent`, `CardFooter`, `CardFrame`, `CardFrameHeader`, `CardFrameTitle`, `CardFrameDescription`, `CardFrameAction`, and `CardFrameFooter`. `CardContent` is the same component value as `CardPanel`.

Every part defaults to `div`, supports polymorphic rendering, keeps its `data-slot`, and preserves the complete source class string. This includes frame clipping variables, nested-card selectors, table-container selectors, pseudo-element highlights, and conditional panel/header/footer spacing.

The parity fixture maps two upstream particles without hybrid copy:

- p-card-1: Create project header and description; Name input; Framework Select with Next.js, Vite, Remix, and Astro; Deploy submit button; and the exact completion notice.
- p-card-11: Project frame header and description; outline Add button; nested Card/Panel/Empty hierarchy; and the exact “No projects yet” copy.

## Svelte mapping and proof

- Base UI `render` becomes an explicit `as` prop on production Card parts.
- A private zero-DOM `CardPart` component centralizes class merging, snippet rendering, native prop forwarding, and bindable refs.
- The p-card-1 preview uses production Input, an explicit native label association, and Shards Select's `Root/Trigger/Value/Icon/Portal/Positioner/Popup/ScrollUpArrow/List/Item/ItemIndicator/ScrollDownArrow` composition.
- The p-card-11 preview uses production Empty inside the nested production Card.
- The fixture-local Button helper uses Shards Button and exact COSS class variants. It adds no DOM wrapper.
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

The Codex in-app Browser was requested for the manual comparison on 2026-08-27, but the runtime reported no available in-app Browser surface. No manual Browser claim is recorded; manual light/dark visual review remains an integration check.

Accepted component deviations: none.
