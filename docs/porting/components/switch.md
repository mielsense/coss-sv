# Switch port evidence

## COSS sources inspected

- Component: `reference/apps/ui/registry/default/ui/switch.tsx`
- Documentation: `reference/apps/ui/content/docs/components/switch.mdx`
- Documentation particles: `p-switch-1.tsx` through `p-switch-6.tsx`
- Additional direct particles: `p-field-15.tsx`, `p-switch-7.tsx`, `p-switch-8.tsx`, and `p-switch-9.tsx`
- Generated registry mirrors were checked under `reference/apps/ui/public/r/` and `reference/apps/ui/registry/__index__.tsx`; implementation evidence comes from the TSX sources above.

The inspection covered the exact root and thumb classes, responsive `--thumb-size`, 22/18 px default geometry, checked translation, active-state stretch and radius, wrapping and sibling labels, custom sizing, controlled availability-editor use, disabled state, and native form values.

## Shards sources inspected

- Implementation: every file in `shardsui/packages/shardsui/src/lib/components/switch/`
- Tests: `switch-root.test.ts`, `switch-thumb.test.ts`, and every fixture in `shardsui/packages/shardsui/tests/switch/fixtures/`
- Documentation and demo: `shardsui/docs/src/content/switch.md` and `shardsui/docs/src/lib/components/content/demos/switch/hero/demo.svelte`

Shards supplies the bindable state, checked-change callback, hidden native input, external-form association, generated IDs, wrapping/sibling label behavior, controlled-state veto, disabled/read-only behavior, Enter and Space keyboard handling, and hydration-safe state attributes. The COSS wrapper supplies the exact root/thumb classes and slot attributes.

## Port and verification

- Port: `packages/ui/src/components/ui/switch/switch.svelte`
- Component barrel: `packages/ui/src/components/ui/switch/index.ts`
- SSR/type coverage: `switch.test.ts` and `switch.types.test.ts`
- Browser/hydration coverage: `switch.browser-fixture.svelte` and `switch.browser.test.ts`
- Exact review fixture: `apps/ui/src/lib/parity/components/switch.svelte`
- Headless parity: `tests/e2e/switch.spec.ts`

The Svelte API uses `checked` as the initial value when it is not bound and `bind:checked` for controlled use. `onCheckedChange` receives the next boolean. The root remains the same default `<span role="switch">` plus hidden native checkbox arrangement used by the pinned Base UI implementation.

The exact fixture reproduces `p-switch-1` through `p-switch-4` and `p-switch-6`. `p-switch-5` depends on the unported COSS `Field`, `FieldLabel`, and `Form` components; the fixture does not replace them with lookalikes. Its native form-state contract is covered by a separate review probe without claiming particle parity.

The root retains the upstream `rounded-full` class. Chromium serializes that fully rounded computed radius as a very large pixel value rather than half the control height; parity therefore asserts the exact source class and that the computed radius exceeds the control height instead of substituting a 9px or 11px value.

Focus-ring parity is entered by keyboard Tab so the `focus-visible` selectors are exercised. Programmatic focus after a pointer click is intentionally not treated as visible keyboard focus by the browser.

Final focused verification on August 27, 2026: the combined C5 Svelte/Vitest gate passed 15 files and 47 tests; the combined light, dark, mobile, desktop, keyboard, axe, and motion Playwright gate passed 17 tests with four intentional static Toggle/Toggle Group motion-project skips; Svelte check reported 0 errors and 0 warnings; Biome checked 46 C5 files without diagnostics; and `git diff --check` passed.

The Codex in-app Browser was requested again for the final Switch comparison, but its browser list was empty. No Chrome substitute was used. Automated headless parity remains green, and the missing manual pass is recorded rather than claimed.
