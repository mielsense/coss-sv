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
- `Accordion.Trigger` keeps the COSS class string and component-owned chevron indicator. The wrapper does not add a nested heading.
- `Accordion.Panel` applies the motion classes to the Shards panel and applies the consumer class to the inner content `div`, matching COSS.
- `defaultValue` initializes the bindable Shards `value` once. Later default prop changes do not replace uncontrolled state. `AccordionContent` remains an alias for `AccordionPanel`.
- COSS does not define orientation behavior for Accordion. Orientation coverage in this lane belongs to Tabs.

## D4 documentation coverage

The Svelte page preserves the four upstream previews in order. The four particles retain the source
copy and cover the initial value, single selection, multiple selection, and controlled selection.
`apps/ui/tests/docs/d4-disclosure.test.ts` locks their ownership, metadata, source syntax, and page
order. `tests/e2e/d4-disclosure-docs.spec.ts` opens each route in the required themes and widths,
rejects console and external-resource failures, and exercises the trigger with Enter.
