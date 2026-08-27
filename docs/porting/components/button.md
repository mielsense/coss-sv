# Button port evidence

## COSS sources inspected

- Component: `reference/apps/ui/registry/default/ui/button.tsx`
- Documentation: `reference/apps/ui/content/docs/components/button.mdx`
- Dedicated particles: `p-button-1.tsx` through `p-button-24.tsx`, `p-button-26.tsx` through `p-button-41.tsx` (there is no `p-button-25.tsx`)
- Direct composition particles: every TSX file importing `@/registry/default/ui/button` was freshly enumerated and its actual Button nodes were inspected. Exact basenames: `p-accordion-4`; `p-alert-3`; `p-alert-dialog-1..2`; `p-autocomplete-13`; `p-breadcrumb-1,4`; `p-calendar-15,16,20,21`; `p-card-1..11`; `p-checkbox-5`; `p-checkbox-group-5`; `p-combobox-10,11,12,19,20`; `p-command-1..2`; `p-date-picker-1..7,9`; `p-dialog-1..6`; `p-drawer-1..14`; `p-empty-1`; `p-field-6,18`; `p-form-1..2`; `p-frame-2`; `p-group-1..6,9..16,20,23`; `p-input-7..10`; `p-input-group-7..9,12,15,17..19,21..23,26..29`; `p-menu-1..9`; `p-number-field-10`; `p-pagination-2..3`; `p-popover-1..4`; `p-preview-card-1`; `p-radio-group-5`; `p-select-11`; `p-sheet-1..3`; `p-skeleton-1`; `p-slider-14,21..23`; `p-switch-5,7..9`; `p-table-4,8`; `p-textarea-6,14,15`; `p-toast-1..13`; `p-toolbar-1`; and `p-tooltip-1,4` under `reference/apps/ui/registry/default/particles/`.
- Direct application and wrapper usages: `app/docs/[[...slug]]/page.tsx`, `app/not-found.tsx`, `app/page.tsx`, `app/particles/particle-card.tsx`, `components/code-block-command.tsx`, `components/code-collapsible-wrapper.tsx`, `components/command-menu.tsx`, `components/copy-registry.tsx`, `components/docs-copy-page.tsx`, `components/main-nav.tsx`, `components/mobile-nav.tsx`, `mdx-components.tsx`, `registry/default/ui/dialog.tsx`, `drawer.tsx`, `pagination.tsx`, `sheet.tsx`, `sidebar.tsx`, and `toast.tsx`. The generated `registry/__index__.tsx` entries were checked as mirrors, not used as implementation authority.

The inspection covered all seven variants, all ten sizes, custom class merging, native disabled and default `type="button"`, loading width preservation and spinner placement, icon sizing, refs and callbacks, `data-pressed` consumers, trigger composition, arbitrary render targets, and semantic links.

## Shards sources inspected

- Implementation: every file in `shardsui/packages/shardsui/src/lib/components/button/`
- Tests: `shardsui/packages/shardsui/tests/button/button.test.ts`
- Documentation and demos: `shardsui/docs/src/content/button.md`, `shardsui/docs/src/lib/components/content/demos/button/hero/demo.svelte`, and `loading/demo.svelte`

Shards supplies native-button defaults, polymorphic button semantics, disabled interaction suppression, keyboard activation, and bindable refs. The COSS wrapper supplies the exact variants, sizes, slots, loading behavior, and spinner.

## Svelte API translation

React's `render={<Link />}` composition is translated to a semantic Svelte link by providing `href` (and optionally `as="a"`). The link branch deliberately renders a native `<a>` without `role="button"`, following the inspected Shards guidance that links keep link semantics. Other `as` targets use the Shards Button primitive and retain button keyboard semantics. The wrapper forwards `type` only to a native `<button>`; disabled non-button targets keep Shards' `aria-disabled`, `data-disabled`, `tabindex="-1"`, and blocked click/Enter/Space behavior. Loading adds its `aria-disabled` override only while loading is true, so it does not erase Shards' computed disabled state. Loading also adds `data-loading` and the built-in absolute spinner while leaving the label mounted.

## Port and verification

- Port: `packages/ui/src/components/ui/button/button.svelte`
- Component barrel: `packages/ui/src/components/ui/button/index.ts`
- SSR/type coverage: `button.test.ts` and `button.types.test.ts`
- Browser/hydration coverage: `button.browser-fixture.svelte` and `button.browser.test.ts`
- Exact review fixture: `apps/ui/src/lib/parity/components/button.svelte`
- Headless parity: `tests/e2e/button.spec.ts`

The review fixture ports the documented `p-button-1` through `p-button-18` examples and the built-in-loading `p-button-41` example. It uses neutral particle wrappers and keeps each particle root untouched. The coordinator integrated the package-root barrel before the fixture imported `@coss-sv/ui`.

The default button computes to a 10px radius from the upstream `rounded-lg` token, 32px by default above the `sm` breakpoint and 36px at 390px, with 500 font weight. The smaller `xs` and `icon-xs` sizes use the upstream `rounded-md` override.

COSS gives Button a `transition-shadow` class but no animation. The parity suite verifies the same transition contract and `animation-name: none` under both reduced-motion and normal-motion Playwright projects; it does not invent a reduced-motion override absent from upstream.

Final focused verification on August 27, 2026: the combined C5 Svelte/Vitest gate passed 15 files and 47 tests; the combined light, dark, mobile, desktop, keyboard, axe, and motion Playwright gate passed 17 tests with four intentional static Toggle/Toggle Group motion-project skips; Svelte check reported 0 errors and 0 warnings; Biome checked 46 C5 files without diagnostics; and `git diff --check` passed.

The Codex in-app Browser was requested again for the final Button comparison, but its browser list was empty. No Chrome substitute was used. Automated headless parity remains green, and the missing manual pass is recorded rather than claimed.
