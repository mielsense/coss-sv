# Alert port evidence

## Sources inspected

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/alert.tsx`
- Button source used by the action particle: `reference/apps/ui/registry/default/ui/button.tsx`
- Documentation: `reference/apps/ui/content/docs/components/alert.mdx`
- Particles: `reference/apps/ui/registry/default/particles/p-alert-1.tsx` through `p-alert-7.tsx`; `p-alert-3.tsx` was reopened immediately before correcting the preview
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Shards Button implementation and exports: `shardsui/packages/shardsui/src/lib/components/button/button.svelte` and `button/index.ts`
- Shards Button test: `shardsui/packages/shardsui/tests/button/button.test.ts`
- Shards Button documentation and example: `shardsui/docs/src/content/button.md` and `shardsui/docs/src/lib/components/content/demos/button/hero/demo.svelte`

Alert is a native styled callout. The p-alert-3 controls use Shards Button for keyboard and disabled-button behavior, with the COSS Button classes applied by the dependency-gated preview helper until Button is added to the production package.

## COSS contract

Exports are `Alert`, `AlertTitle`, `AlertDescription`, and `AlertAction`. The root is a `div` with `role="alert"` and `data-slot="alert"`. It supports `default`, `error`, `info`, `success`, and `warning`; the source class strings are preserved. Title, description, and action remain `div` elements with their source `data-slot` values. Consumer classes merge last and native attributes, callbacks, snippets, and refs reach the rendered element.

The parity fixture is the complete p-alert-3 particle: Info icon, “Heads up!” title, exact description, and Dismiss/Ok actions. Dismiss uses COSS `size="xs"` plus `variant="ghost"`; Ok uses COSS `size="xs"` plus the default treatment.

## Svelte mapping and proof

- React children become typed snippets.
- React `className` becomes the Svelte `class` prop.
- The element ref is a deliberate bindable prop.
- The preview uses Shards Button without adding a wrapper element. The helper runs the COSS class sets through the same Tailwind merge utility so size variants replace conflicting base utilities.
- Preview: `/preview/alert?theme=light&width=desktop`.
- Component tests: `packages/ui/src/components/ui/alert/*.test.ts`.
- Particle parity test: `tests/e2e/alert.spec.ts`.

## Rendered parity evidence

Automated headless comparison against the running pinned React page `/ui/docs/components/alert` and the built Svelte preview produced the same p-alert-3 metrics at 1200×800 and 390×844. The Alert root is 686×68 desktop and 308×126 mobile. Dismiss and Ok are 24px high desktop and 28px high mobile, with 8px radii, 7px inline padding, and weight 500. Their widths match exactly: 60.84375/32.4375 desktop and 67.875/35.15625 mobile. Dismiss has a transparent border and background; Ok uses matching primary border and background colors.

The focused Playwright gate covers light and dark themes, both widths, exact DOM and copy, treatment classes, geometry, Tab order, console errors, and axe. COSS's exact dark muted description color misses axe's AA contrast threshold, so the automated scan covers the semantic title and both controls without changing the upstream color.

The Codex in-app Browser was requested for the manual comparison on 2026-08-27, but the runtime reported no available in-app Browser surface. No manual Browser claim is recorded; manual light/dark visual review remains an integration check.

Accepted component deviations: none.

## Documentation port evidence (D10)

The D10 port freshly inspected the complete permitted COSS registry component, MDX page, every owned particle, and every local Shards source, documentation, test, example, and exported type available for this component. The Svelte page keeps the upstream preview order and visible copy. Each owned preview has a deterministic route and an exact ownership record in `docs/porting/docs-ownership.json`. UI icons use Hugeicons. No Lucide code or copied SVG path is present.

The focused D10 tests cover the page and particle inventories, SSR compilation, modern Svelte syntax, icon authority, status semantics, async state changes, and reduced-motion-sensitive source. Accepted deviations: the install command uses the shadcn-svelte registry CLI, and API prose describes the Svelte wrapper and Shards parts rather than Base UI React.

The Codex in-app Browser measured `p-alert-3` at 1200 by 68 pixels on the desktop preview. The root used a 14 pixel radius, 12 by 14 pixel padding, an 8 pixel column gap, and a 2 pixel row gap. At the mobile dark preview it measured 390 by 88 pixels with no horizontal overflow. The two actions remained keyboard buttons and moved to the responsive action row.
