# Input port evidence

## Reference inspected

- COSS implementation: `reference/apps/ui/registry/default/ui/input.tsx`
- COSS documentation: `reference/apps/ui/content/docs/components/input.mdx`
- Documentation examples: `reference/apps/ui/registry/default/particles/p-input-1.tsx` through `p-input-7.tsx`, plus `p-form-1.tsx`
- Exact standalone `Input` importers under `reference/apps/ui/registry/default/particles/`: `p-card-1` through `p-card-10`, `p-command-2`, `p-dialog-1`, `p-dialog-3`, `p-dialog-6`, `p-drawer-8`, `p-drawer-10`, `p-drawer-12`, `p-field-1` through `p-field-5`, `p-field-18`, `p-fieldset-1`, `p-form-1`, `p-form-2`, `p-group-2`, `p-group-7`, `p-group-8`, `p-group-15` through `p-group-20`, `p-input-1` through `p-input-7`, `p-input-13` through `p-input-15`, `p-input-17` through `p-input-19`, `p-sheet-1`, and `p-sheet-2` (all `.tsx`). This exact inventory contains 50 files.

The inventory scan parses semicolon-bounded named import declarations, requires the module specifier to equal `@/registry/default/ui/input`, resolves the imported `Input` binding including aliases, and counts JSX opening elements for that local binding. A separate fixed-string search for the complete module specifier cross-checks the file set. All 50 imports use the local name `Input` and every file renders at least one matching JSX element. Prefix matches such as `@/registry/default/ui/input-group` are excluded; therefore `p-input-8`, `p-calendar-17`, and the other InputGroup-only particles are not in this inventory.

The React source establishes a wrapper `span` with `data-slot="input-control"` and `data-size`, while `className` styles that wrapper. Native input attributes, style, ref, events, and numeric `size` belong to the inner `data-slot="input"` element. Named sizes change utility classes but do not set the native `size` attribute. `unstyled` removes only the wrapper's default classes. Search and file inputs add type-specific classes.

`defaultValue` and Base UI's `onValueChange` are part of the default primitive contract. The `nativeInput` escape hatch instead renders a native `<input>`: `defaultValue` and native event callbacks remain supported there, but `onValueChange` is not a native DOM API. The port therefore does not invent `onValueChange` behavior for `nativeInput`; native-branch consumers use `oninput` or `onchange`.

## Shards inspected

- `shardsui/packages/shardsui/src/lib/components/input/index.ts`
- `shardsui/packages/shardsui/src/lib/components/field/field-control.svelte`
- `shardsui/packages/shardsui/src/lib/components/field/context.ts`
- `shardsui/packages/shardsui/src/lib/components/field/field.svelte.ts`
- `shardsui/packages/shardsui/src/lib/components/field/field-root.svelte`
- `shardsui/packages/shardsui/tests/input/input.test.ts`
- `shardsui/packages/shardsui/tests/field/field-control.test.ts`
- `shardsui/packages/shardsui/tests/field/fixtures/basic-field.svelte`
- `shardsui/packages/shardsui/tests/field/fixtures/prefilled-required.svelte`
- `shardsui/packages/shardsui/tests/field/fixtures/prevented-change-field.svelte`
- `shardsui/docs/src/content/input.md`
- `shardsui/docs/src/lib/components/content/demos/input/hero/demo.svelte`
- Installed pinned types and runtime: `packages/ui/node_modules/@shardsui/svelte/dist/components/input/index.d.ts`, `packages/ui/node_modules/@shardsui/svelte/dist/components/field/field-control.svelte`, and `field-control.svelte.d.ts`

Shards `Input` is its field control. It supplies generated IDs, Field/Form context registration, accessible descriptions and errors, dirty/filled/focused state, validation hooks, value callbacks, and ref/value bindings. The COSS wrapper remains outside that primitive so Shards state attributes stay on the native input and COSS `has-*` selectors continue to work.

## Svelte contract and proof

`Input` uses `$props()`, deliberate `$bindable()` contracts for `ref` and `value`, typed native input attributes, callback props, and `$derived` class merging. `nativeInput` retains the COSS escape hatch; file inputs avoid an illegal value binding on the native branch. The Shards component's public control type combines input and textarea events, so the wrapper narrows that boundary to the native-input contract without changing runtime behavior.

Tests cover SSR structure and class variants, native numeric size, unstyled output, type errors, ref/value/event forwarding, `defaultValue`, Shards `onValueChange`, disabled inputs, form submission, ARIA invalid state, and Shards Field dirty/filled state. The browser suite selects actual `File` objects on both the default Shards-backed file input and the `nativeInput` file branch, then verifies each `FileList`, native change callback, and submitted `FormData`. It also separately exercises the non-file `nativeInput` value/ref/event branch and hydrates server-equivalent native-branch markup without warnings. The parity fixture is `apps/ui/src/lib/parity/components/input-c3.svelte`; Playwright coverage is `tests/e2e/input-c3.spec.ts`.

The parity fixture keeps `p-input-1` and `p-input-5` unchanged inside separate neutral 16rem docs-width shells. Fresh React measurements give a 256px wrapper and 254px input at both 1200px and 390px viewports. Wrapper/input heights are 32px/30px on desktop and 36px/34px on mobile. Playwright checks those values, the exact light and dark border/background colors, the settled ring color and 3px focus shadow, the file-input classes, and a real file selection.

The static text-input particle passes axe in both themes. Chromium axe reports 4.46:1 for the dark Shards file input's muted filename text. The React file input has the same computed foreground and effective background colors, but axe does not report that native control. The file parity check therefore asserts its accessible name and exact colors directly; it does not change COSS colors to silence the engine difference.
