# Meter port evidence

## COSS files inspected

- Implementation: `reference/apps/ui/registry/default/ui/meter.tsx`
- Documentation: `reference/apps/ui/content/docs/components/meter.mdx`
- Every direct importer: `p-meter-1.tsx`, `p-meter-2.tsx`, `p-meter-3.tsx`, and `p-meter-4.tsx`

The exact-module scan required `@/registry/default/ui/meter`. Generated registry files were not counted as separate examples. The root has no COSS `data-slot`; it is a full-width column with an 8px gap. An omitted children snippet produces Track and Indicator. Explicit children replace that default. Label, Track, Indicator, and Value use the exact classes and slots from the React source.

## Shards files inspected

Every file under `shardsui/packages/shardsui/src/lib/components/meter/` and `shardsui/packages/shardsui/tests/meter/` was read, plus `shardsui/docs/src/content/meter.md` and the meter hero demo. The installed beta.0 runtime and types under `packages/ui/node_modules/@shardsui/svelte/dist/components/meter/` match the local behavior.

Shards supplies clamping, percentage formatting, label IDs, `role="meter"`, ARIA value attributes, the hidden NVDA presentation span, custom ranges, custom format/locale, polymorphism, refs, and snippet arguments. The COSS wrapper keeps those semantics and only adds the source classes and slots. The indicator uses Shards' inline `inset-inline-start`, `height`, and percentage `width`; the React reference does not expose a CSS custom property, so the port does not invent one.

## Rendered reference check

At value 75, the first React docs preview measured 256px by 36px. Its track was 256px by 8px and its indicator was 192px by 8px with `width:75%`. The indicator transition was `all 500ms`. Browser tests cover label association, announcements, value formatting, bounds, custom ranges, updates, refs, exact inline width, SSR, types, and hydration. The Codex in-app Browser was unavailable, so manual light/dark and mobile comparison remains blocked without a Chrome substitute.
