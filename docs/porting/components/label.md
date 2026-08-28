# Label port evidence

## Reference inspected

- COSS implementation: `reference/apps/ui/registry/default/ui/label.tsx`
- COSS documentation: `reference/apps/ui/content/docs/components/label.mdx`
- Every importing particle under `reference/apps/ui/registry/default/particles/`: `p-autocomplete-5`, `p-checkbox-1` through `p-checkbox-4`, `p-checkbox-group-1` through `p-checkbox-group-4`, `p-combobox-5`, `p-group-7`, `p-group-8`, `p-group-17`, `p-group-22`, `p-input-6`, `p-input-13`, `p-input-14`, `p-input-group-12`, `p-input-group-26`, `p-number-field-5`, `p-popover-4`, `p-radio-group-1` through `p-radio-group-4`, `p-slider-21`, `p-switch-1` through `p-switch-4`, `p-switch-7` through `p-switch-9`, `p-textarea-5`, `p-textarea-7`, and `p-textarea-8` (all `.tsx`).

The same exact-module import scan requires `@/registry/default/ui/label`, resolves the named `Label` binding including aliases, and verifies a matching JSX opening element. It finds 36 files, all using the local name `Label`; the listed set has no substring-module or unused-import false positives.

The default element is a native `label` with `data-slot="label"`. The exact base classes are `inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4`. Consumer classes merge last. COSS also permits a rendered alternate element; examples use a `span` for non-interactive secondary copy and use native label activation through `htmlFor` elsewhere.

The reference Label page's “With Checkbox” section names `checkbox-demo`, but no `checkbox-demo` particle exists under `reference/apps/ui/registry/default/particles/` and no registry source in the licensed subtree defines it. An exact `checkbox-demo` search finds only the dangling MDX reference and the upstream skill inventory. The port records the missing reference rather than substituting a different checkbox example as if it were the documented source; native label activation is proven from the existing `p-input-6` contract and the actual Label-importing checkbox particles remain part of the importer audit above.

## Shards inspected

- `shardsui/packages/shardsui/src/lib/components/field/field-label.svelte`
- `shardsui/packages/shardsui/src/lib/components/field/context.ts`
- `shardsui/packages/shardsui/tests/field/field-label.test.ts`
- `shardsui/packages/shardsui/tests/field/fixtures/dynamic-id-field.svelte`
- `shardsui/packages/shardsui/tests/field/fixtures/field-control-swap.svelte`
- `shardsui/packages/shardsui/tests/field/fixtures/remove-control-id.svelte`
- `shardsui/packages/shardsui/tests/field/fixtures/span-label-field.svelte`
- `shardsui/docs/src/lib/components/content/demos/field/hero/demo.svelte`
- Installed pinned type: `packages/ui/node_modules/@shardsui/svelte/dist/components/field/field-label.svelte.d.ts`

Shards `Field.Label` requires Field context and automatically associates a registered control. COSS `Label` is standalone and is used around checkboxes, switches, radio items, and plain controls without Field context. Wrapping the Shards label would therefore change valid usage and DOM behavior. This port uses a native dynamic element and leaves Shards field association to the later `FieldLabel` port.

## Svelte contract and proof

The Svelte API uses `for` instead of React's `htmlFor`, snippets instead of React children, `as` instead of Base UI's `render`, and a bindable element ref. SSR and browser tests cover exact classes, consumer overrides, forwarded native attributes, alternate elements, ref binding, native label activation, and warning-free hydration of server-equivalent markup. The parity fixture is `apps/ui/src/lib/parity/components/label-c3.svelte`; Playwright coverage is `tests/e2e/label-c3.spec.ts`.

The parity fixture keeps the `p-input-6` root class `flex flex-col items-start gap-2` unchanged inside a neutral 16rem docs-width shell. Fresh React measurements give a 256px root, 8px gap, and 56px desktop or 62px mobile height. Playwright asserts that geometry as well as native label activation.

## D6 documentation port

The Label page keeps the upstream example order and the exact `checkbox-demo` identifier. Fresh full-tree inspection confirmed that `checkbox-demo` has no source under the permitted `reference/apps/ui/**` boundary, so the page does not invent a replacement. `p-input-6` remains the complete visible Label example and retains its native `for`/`id` association.

The D6 source test asserts both the dangling upstream identifier and the missing licensed source. The Label page is deliberately excluded from eager SVX compilation until the coordinator resolves that registry seam; the other nine D6 pages compile and SSR render.
