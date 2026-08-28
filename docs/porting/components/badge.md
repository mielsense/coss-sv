# Badge port evidence

## Sources inspected

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/badge.tsx`
- Documentation: `reference/apps/ui/content/docs/components/badge.mdx`
- Primary particles: `p-badge-1.tsx` through `p-badge-20.tsx`
- Other importing particles: `p-avatar-10.tsx`, `p-avatar-11.tsx`, `p-button-32.tsx`, `p-combobox-19.tsx`, `p-combobox-20.tsx`, `p-date-picker-7.tsx`, `p-group-11.tsx`, `p-group-23.tsx`, `p-input-group-10.tsx`, `p-input-group-18.tsx`, `p-popover-4.tsx`, `p-table-1.tsx` through `p-table-8.tsx`, `p-tabs-10.tsx`, and `p-tabs-12.tsx`, all under `reference/apps/ui/registry/default/particles/`
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Closest Shards source: `shardsui/packages/shardsui/src/lib/components/button/button.svelte` and `index.ts`
- Shards test: `shardsui/packages/shardsui/tests/button/button.test.ts`
- Shards docs and examples: `shardsui/docs/src/content/button.md`, `shardsui/docs/src/lib/components/content/demos/button/hero/demo.svelte`, and `loading/demo.svelte`

Badge is a native styled element. It does not wrap Shards Button because links must retain link semantics and a `span` badge must not gain button keyboard behavior. The Shards source establishes the local `as`, snippet, native-attribute, callback, and bindable-ref pattern.

## COSS contract

The default tag is `span`; Base UI `render` permits another tag without injecting semantics. The Svelte port exposes the equivalent explicit `as` prop. Variants are `default`, `destructive`, `error`, `info`, `outline`, `secondary`, `success`, and `warning`. Sizes are `default`, `sm`, and `lg`. `badgeVariants` remains public. All exact class strings, responsive sizes, icon selectors, coarse-pointer hit-area selectors, and `data-slot="badge"` are preserved.

Examples prove links, icons, counts, circular badges, selectable/removable compositions, avatars, tabs, tables, groups, inputs, date selection, and status displays. Interactive behavior belongs to the nested native or headless control, not Badge itself.

## Svelte mapping and proof

- Base UI `render={<a />}` becomes `as="a" href="…"`.
- Children are a typed snippet; attributes and callbacks spread to the selected element; `ref` is bindable.
- Preview: `/preview/badge?theme=light&width=desktop`.
- Tests: `packages/ui/src/components/ui/badge/*.test.ts` and `tests/e2e/badge.spec.ts`.

## Browser parity evidence

Compared in the Codex in-app Browser on 2026-08-27 against `/ui/docs/components/badge` and the target preview in light and dark themes at desktop and mobile widths. The port preserves the reference tags, slots, responsive typography, icon selectors, and variant classes. Computed dimensions match at the applicable breakpoint: 18px default, 16px small, and 22px large heights; 3px default and 5px large horizontal padding; 6px default and 4px small radii; and a 4px content gap. The polymorphic example remains a native anchor with its `href`, accepts keyboard focus, and displays the reference focus treatment. Fresh target navigations produced no console warnings, errors, or hydration messages. The focused Playwright run checks both themes and widths with axe. COSS's exact destructive badge treatment is 12px white text on red-500 and does not meet axe's AA contrast threshold; the test keeps that upstream visual contract and runs axe over every other variant.

Accepted deviations: none.

## Documentation port evidence (D10)

The D10 port freshly inspected the complete permitted COSS registry component, MDX page, every owned particle, and every local Shards source, documentation, test, example, and exported type available for this component. The Svelte page keeps the upstream preview order and visible copy. Each owned preview has a deterministic route and an exact ownership record in `docs/porting/docs-ownership.json`. UI icons use Hugeicons. No Lucide code or copied SVG path is present.

The focused D10 tests cover the page and particle inventories, SSR compilation, modern Svelte syntax, icon authority, status semantics, async state changes, and reduced-motion-sensitive source. Accepted deviations: the install command uses the shadcn-svelte registry CLI, and API prose describes the Svelte wrapper and Shards parts rather than Base UI React.
