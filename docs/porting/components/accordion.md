# Accordion port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/accordion.tsx`
- `reference/apps/ui/content/docs/components/accordion.mdx`
- `reference/apps/ui/registry/default/particles/p-accordion-1.tsx`
- `reference/apps/ui/registry/default/particles/p-accordion-2.tsx`
- `reference/apps/ui/registry/default/particles/p-accordion-3.tsx`
- `reference/apps/ui/registry/default/particles/p-accordion-4.tsx`

The `apps/ui` subtree has no Accordion test file. The four particles cover an initially open item, single selection, multiple selection, and controlled selection with a Button.

## Shards files inspected

The inspection covered every file under `shardsui/packages/shardsui/src/lib/components/accordion/`, the Accordion documentation and both demos, all five Accordion test files, and their fixtures. The installed `0.1.0-beta.0` declarations were checked against the local source.

Shards owns selection state, disabled handling, trigger and panel IDs, ARIA relationships, panel mounting, transition state, and measured panel dimensions.

## Translation decisions

- The Svelte API uses `Accordion.Root`, `Accordion.Item`, `Accordion.Header`, `Accordion.Trigger`, and `Accordion.Panel`.
- `Accordion.Header` renders the COSS `flex` heading wrapper. Svelte examples must include it explicitly.
- `Accordion.Trigger` keeps the COSS class string and built-in Chevron Down indicator. The indicator uses the free `ArrowDown01Icon` data with `strokeWidth={2}` through the local SSR-safe Hugeicons renderer, remains hidden from assistive technology, and preserves the source size, offset, opacity, transition, and open-state rotation classes. The wrapper does not add a nested heading.
- `Accordion.Panel` applies the motion classes to the Shards panel and applies the consumer class to the inner content `div`, matching COSS.
- `defaultValue` initializes the bindable Shards `value` once. Later default prop changes do not replace uncontrolled state. `AccordionContent` remains an alias for `AccordionPanel`.
- COSS does not define orientation behavior for Accordion. Orientation coverage in this lane belongs to Tabs.

## D4 documentation coverage

The Svelte page preserves the four upstream previews in order. The four particles keep the source
sentence structure, item order, values, and layout. Framework-specific references now use the local
`ShardsUI` brand and describe its headless, accessible Svelte 5 components instead of Base UI's
React package. Each D4 pnpm command installs every package imported by its displayed Svelte blocks.
Card and Empty also install `@hugeicons/svelte` and `@hugeicons/core-free-icons`; the other six
pages import only `@coss-sv/ui`. The shadcn-svelte tab keeps its component-specific registry command.
The repair check packed `@coss-sv/ui@0.0.0`, installed the Card command in a new pnpm project, and
resolved the Card, Hugeicons Svelte, and Hugeicons icon-data imports from that project.
`apps/ui/tests/docs/d4-disclosure.test.ts` locks their ownership, metadata, source syntax, and page
order. It also rejects React and Base UI copy and checks that each install command matches the
displayed package imports. `tests/e2e/d4-disclosure-docs.spec.ts` opens each route in the required
themes and widths, rejects console and external-resource failures, and exercises the trigger with
Enter. The package source, SSR, and browser tests reject copied Lucide or inline icon source,
require the official Hugeicons path geometry before hydration with two-pixel strokes, and check the
decorative and open-state rotation contracts.
