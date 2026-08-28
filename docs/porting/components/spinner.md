# Spinner port evidence

## COSS files inspected

- Implementation: `reference/apps/ui/registry/default/ui/spinner.tsx`
- Documentation: `reference/apps/ui/content/docs/components/spinner.mdx`
- Direct particle importers: `p-autocomplete-12.tsx`, `p-autocomplete-16.tsx`, `p-button-18.tsx`, `p-button-40.tsx`, `p-command-2.tsx`, `p-input-12.tsx`, `p-input-16.tsx`, `p-input-group-16.tsx`, `p-spinner-1.tsx`, and `p-toast-8.tsx`
- Direct production use: `reference/apps/ui/registry/default/ui/button.tsx`

All 11 direct uses were read in full. Generated registry JSON was treated as a mirror. COSS renders Lucide's LoaderCircle with `animate-spin`, default `aria-label="Loading"`, and `role="status"`, then spreads consumer props last.

Shards has no Spinner component. Per the component plan, its complete Progress source, docs, demo, and tests were inspected as the nearest status primitive. Spinner needs no Shards behavior; it delegates its loading glyph to Hugeicons.

## Svelte and rendered contract

The typed contract includes `size`, `strokeWidth`, and `absoluteStrokeWidth`. A default `size` of 24 sets both dimensions, while explicit `width` or `height` wins. Absolute stroke width keeps the established `strokeWidth * 24 / size` calculation. The component keeps a bindable SVG ref, forwards native callbacks and attributes, and adds no wrapper or shared module state.

The first React docs preview computed to a 24px SVG with `spin 1s linear infinite`, accessible name `Loading`, and status role. COSS has no reduced-motion class, so reduced motion retains that animation for parity. Tests cover default dimensions, explicit dimension overrides, absolute stroke width, SSR markup, mounted Hugeicons paths, callbacks, refs, status announcement, tab order, types, and hydration. The docs parity E2E fixture checks the computed animation in both motion modes. The Codex in-app Browser was unavailable during implementation, and no external browser was used.

## Hugeicons authority update

Spinner now renders the free `Loading02Icon`, the closest partial-ring glyph, through the local SSR-safe Hugeicons renderer. The component preserves its SVG root, default `Loading` name, `status` role, native callbacks, bindable SVG ref, animation class, explicit dimensions, absolute-stroke calculation, and consumer `children` snippet. Native fill, stroke, line-cap, line-join, size, class, ref, and remaining SVG attributes reach the root; explicit drawing attributes also override the official glyph data consistently. The renderer emits only the four SVG node types present in the inspected free icon pack and never accepts HTML or copied glyph paths. Tests cover server paths, hydration, mounted paths, attribute precedence, child order, callbacks, refs, status semantics, types, and animation.

## Documentation port evidence (D10)

The D10 port freshly inspected the complete permitted COSS registry component, MDX page, every owned particle, and every local Shards source, documentation, test, example, and exported type available for this component. The Svelte page keeps the upstream preview order and visible copy. Each owned preview has a deterministic route and an exact ownership record in `docs/porting/docs-ownership.json`. UI icons use Hugeicons. No Lucide code or copied SVG path is present.

The focused D10 tests cover the page and particle inventories, SSR compilation, modern Svelte syntax, icon authority, status semantics, async state changes, and reduced-motion-sensitive source. Accepted deviations: the install command uses the shadcn-svelte registry CLI, and API prose describes the Svelte wrapper and Shards parts rather than Base UI React.
