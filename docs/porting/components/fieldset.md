# Fieldset port evidence

## source record

- COSS component and documentation: `reference/apps/ui/registry/default/ui/fieldset.tsx` and `reference/apps/ui/content/docs/components/fieldset.mdx`
- Particles read in full: `p-fieldset-1`, `p-field-13`, `p-field-14`, `p-checkbox-group-5`, `p-radio-group-5`, `p-radio-group-6`, `p-slider-15`, `p-slider-21`, and `p-slider-23`, all `.tsx`
- Shards source read in full: the complete `src/lib/components/fieldset/` directory
- Shards proof read in full: every Fieldset test and fixture, `docs/src/content/fieldset.md`, and the Fieldset hero demo
- Commits: COSS `19620ae8cae81e30775f2cde03829326cb4916b2`; Shards `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`

## contract and mapping

The root has no default COSS class. Legend uses `font-semibold text-foreground`. Shards propagates disabled state through nested fieldsets and fields. A small local coordination context registers the same generated Legend ID and writes `aria-labelledby`; Field's single-root Fieldset mode shares that context. The local context resolves disabled as `disabled || parent.disabled`, matching Shards exactly, so a Legend beneath an enabled nested root still receives disabled metadata and a `{ disabled: true }` snippet state when an ancestor Fieldset is disabled.

The live COSS page confirmed one non-obvious detail: the default `FieldsetLegend` tag is `DIV`, not native `LEGEND`. The reference fieldset points to it with `aria-labelledby`. The port leaves the Shards default intact and still accepts `as="legend"` when a consumer wants native legend markup.

SSR, hydration, and browser tests cover slots, exact classes, generated and explicit legend IDs, nested disabled propagation on root and Legend metadata, Legend snippet state, native disabled descendants, polymorphism, refs, and aliases. `apps/ui/src/lib/parity/components/fieldset.svelte` reproduces the only standalone Fieldset particle, `p-fieldset-1`, with its exact full-width, `max-w-64` preview metadata and `id` plus `data-particle` review selectors. There are no dependency-gated standalone Fieldset particles.
