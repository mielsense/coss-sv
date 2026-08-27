# Textarea port evidence

## Reference inspected

- COSS implementation: `reference/apps/ui/registry/default/ui/textarea.tsx`
- COSS documentation: `reference/apps/ui/content/docs/components/textarea.mdx`
- Every importing particle under `reference/apps/ui/registry/default/particles/`: `p-dialog-4`, `p-field-10`, `p-popover-1`, and `p-textarea-1` through `p-textarea-15` (all `.tsx`).

The same exact-module import scan requires `@/registry/default/ui/textarea`, resolves the named `Textarea` binding including aliases, and verifies a matching JSX opening element. It finds 18 files, all using the local name `Textarea`; the listed set has no substring-module or unused-import false positives.

The React source renders a wrapper `span` with `data-slot="textarea-control"`, `data-size`, and consumer classes. A Base UI field control renders the inner native `textarea` with `data-slot="textarea"`. Native attributes, value/default value, disabled, ID, name, ref, and events belong to the textarea. Named sizes change min-height and padding classes. Numeric `size` remains wrapper metadata; caller-provided `rows` remains a native attribute. Content sizing is CSS-only through `field-sizing-content`; there is no JavaScript autoresize behavior.

## Shards inspected

- `shardsui/packages/shardsui/src/lib/components/field/field-control.svelte`
- `shardsui/packages/shardsui/src/lib/components/field/context.ts`
- `shardsui/packages/shardsui/src/lib/components/field/field.svelte.ts`
- `shardsui/packages/shardsui/src/lib/components/field/field-root.svelte`
- `shardsui/packages/shardsui/src/lib/components/field/field-error.svelte`
- `shardsui/packages/shardsui/tests/field/field-control.test.ts`
- `shardsui/packages/shardsui/tests/field/field-error.test.ts`
- `shardsui/packages/shardsui/tests/field/field-root.test.ts`
- `shardsui/packages/shardsui/tests/field/fixtures/basic-field.svelte`
- `shardsui/packages/shardsui/tests/field/fixtures/prefilled-required.svelte`
- `shardsui/packages/shardsui/tests/field/fixtures/prevented-change-field.svelte`
- `shardsui/packages/shardsui/tests/field/fixtures/validated-field.svelte`
- `shardsui/docs/src/content/field.md`
- `shardsui/docs/src/lib/components/content/demos/field/hero/demo.svelte`
- Installed pinned runtime and type: `packages/ui/node_modules/@shardsui/svelte/dist/components/field/field-control.svelte` and `field-control.svelte.d.ts`

`Field.Control as="textarea"` is the matching primitive. It preserves native textarea semantics while registering with Shards Field/Form context and forwarding generated IDs, accessible relationships, dirty/filled/focused state, validation hooks, value callbacks, and ref/value bindings.

## Svelte contract and proof

`Textarea` uses `$props()`, typed native textarea attributes, deliberate `$bindable()` ref/value contracts, and `$derived` class merging. No effect or shared mutable module state is needed. Tests cover SSR structure and variants, native rows, numeric size metadata, unstyled output, type errors, ref/value/event forwarding, `defaultValue`, `onValueChange`, read-only and ARIA invalid states, form submission, and Shards Field dirty/filled state. Browser coverage clears an initially valid required textarea under Shards `Field.Root`, verifies native constraint validation, the visible `Field.Error`, `aria-invalid`, and the automatically generated `aria-describedby` relationship. It also hydrates server-equivalent Shards-backed textarea markup without warnings. The parity fixture is `apps/ui/src/lib/parity/components/textarea-c3.svelte`; Playwright coverage is `tests/e2e/textarea-c3.spec.ts`.

The parity fixture keeps `p-textarea-1` unchanged inside a neutral 16rem docs-width shell. Fresh React measurements give a 256px wrapper and 254px textarea at both 1200px and 390px viewports. Wrapper/textarea heights are 72px/70px on desktop and 84px/82px on mobile. Playwright checks those values, exact light and dark border/background colors, the settled ring color and 3px focus shadow, input behavior, and axe.
