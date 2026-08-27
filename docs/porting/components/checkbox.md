# Checkbox port evidence

## COSS sources inspected

- Component: `reference/apps/ui/registry/default/ui/checkbox.tsx`
- Documentation: `reference/apps/ui/content/docs/components/checkbox.mdx`
- Documentation particles: `p-checkbox-1.tsx` through `p-checkbox-5.tsx`
- Checkbox-group particles that directly compose Checkbox: `p-checkbox-group-1.tsx` through `p-checkbox-group-5.tsx`
- Other direct source usages: `p-badge-19.tsx`, `p-field-12.tsx`, `p-field-13.tsx`, `p-field-18.tsx`, `p-popover-4.tsx`, `p-switch-7.tsx`, `p-switch-8.tsx`, `p-switch-9.tsx`, `p-table-3.tsx`, `p-table-4.tsx`, `p-table-6.tsx`, and `p-table-8.tsx`
- Generated registry mirrors were checked under `reference/apps/ui/public/r/` and `reference/apps/ui/registry/__index__.tsx`; implementation evidence comes from the TSX sources above.

The inspection covered the exact root and indicator classes, responsive 18/16 px sizing, the checked and indeterminate SVG paths, disabled and invalid selectors, enclosing and sibling labels, parent/group use, controlled state, and native form values.

## Shards sources inspected

- Implementation: every file in `shardsui/packages/shardsui/src/lib/components/checkbox/`
- Tests: `checkbox-root.test.ts`, `checkbox-indicator.test.ts`, and every fixture in `shardsui/packages/shardsui/tests/checkbox/fixtures/`
- Documentation and demo: `shardsui/docs/src/content/checkbox.md` and `shardsui/docs/src/lib/components/content/demos/checkbox/hero/demo.svelte`

Shards supplies the bindable state, checked-change callback, hidden native input, external-form association, generated IDs, wrapping/sibling label behavior, mixed state, disabled/read-only behavior, Space keyboard handling, and hydration-safe state attributes. The COSS wrapper supplies the exact classes, slots, and built-in icons. `keepMounted` preserves COSS's always-present indicator DOM and its `data-unchecked:hidden` contract.

## Port and verification

- Port: `packages/ui/src/components/ui/checkbox/checkbox.svelte`
- Component barrel: `packages/ui/src/components/ui/checkbox/index.ts`
- SSR/type coverage: `checkbox.test.ts` and `checkbox.types.test.ts`
- Browser/hydration coverage: `checkbox.browser-fixture.svelte` and `checkbox.browser.test.ts`
- Exact review fixture: `apps/ui/src/lib/parity/components/checkbox.svelte`
- Headless parity: `tests/e2e/checkbox.spec.ts`

The Svelte API uses `checked` as the initial value when it is not bound and `bind:checked` for controlled use, matching Shards' Svelte contract in place of React's `defaultChecked`/`checked` split. `onCheckedChange` receives the next boolean. The root remains the same default `<span role="checkbox">` and hidden native checkbox arrangement used by the pinned Base UI implementation.

### Deferred Checkbox Group API

The C5 `CheckboxProps` API intentionally does not expose COSS's `parent` prop. Exact parity for `p-checkbox-group-3` and `p-checkbox-group-4`, including `parent` and the group's `allValues` contract, is deferred to C8. The current Shards Checkbox Group coordinates child values but does not provide COSS's parent-checkbox or `allValues` behavior.

C8 must extend this existing Checkbox wrapper for that group behavior instead of replacing or forking its visual implementation. It must cover parent checked and indeterminate state, toggling every value in `allValues`, nested parent propagation, controlled value callbacks, keyboard behavior, and form values against the two exact upstream particles. Because that work changes the Checkbox wrapper, the changed Checkbox must pass both the parity/accessibility review and the Svelte-quality review again before integration.

The exact fixture reproduces `p-checkbox-1` through `p-checkbox-4`. `p-checkbox-5` depends on the unported COSS `Field`, `FieldLabel`, and `Form` components; the fixture does not replace them with lookalikes. Its native form-state contract is covered by a separate review probe without claiming particle parity.

Final focused verification on August 27, 2026: the combined C5 Svelte/Vitest gate passed 15 files and 47 tests; the combined light, dark, mobile, desktop, keyboard, axe, and motion Playwright gate passed 17 tests with four intentional static Toggle/Toggle Group motion-project skips; Svelte check reported 0 errors and 0 warnings; Biome checked 46 C5 files without diagnostics; and `git diff --check` passed.

The Codex in-app Browser was requested again for the final Checkbox comparison, but its browser list was empty. No Chrome substitute was used. Automated headless parity remains green, and the missing manual pass is recorded rather than claimed.
