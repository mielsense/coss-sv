# Form port evidence

## source record

- COSS component and documentation: `reference/apps/ui/registry/default/ui/form.tsx` and `reference/apps/ui/content/docs/components/form.mdx`
- Form examples read in full: `p-form-1.tsx` and `p-form-2.tsx`
- Other importers read in full: `p-card-1` through `p-card-10`; `p-radio-group-5`; `p-field-18`; `p-sheet-1`; `p-sheet-2`; `p-number-field-10`; `p-checkbox-group-5`; `p-checkbox-5`; `p-autocomplete-13`; `p-select-11`; `p-slider-23`; `p-combobox-11`; `p-combobox-12`; `p-dialog-1`; `p-dialog-4`; `p-dialog-6`; `p-popover-1`; `p-drawer-10`; `p-drawer-12`; `p-switch-5`; and `p-textarea-6`, all `.tsx`
- Shards source, types, docs, tests, fixtures, and demos read in full: the complete `src/lib/components/form/` directory, `docs/src/content/form.md`, `docs/src/content/forms.md`, and the hero, form-action, and zod demos
- Commits: COSS `19620ae8cae81e30775f2cde03829326cb4916b2`; Shards `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`

## contract and mapping

The wrapper adds only `data-slot="form"`; consumer classes remain untouched. This matters for COSS particles that use `class="contents"` so panel and footer elements share one native form.

Shards renders a real form and forwards `action`, `method`, native `onsubmit`, SvelteKit action URLs, and symbol-keyed Svelte attachments. It prevents submission only when validation fails or `onFormSubmit` is present. A valid form with only `onsubmit` keeps the native event path. The wrapper also forwards the public `validate()` method. Browser tests call `validate()` for every field, call `validate("name")` for one field, attach a `fromAction` probe to the native form, and reproduce `p-form-2` by delivering external errors after a successful submit attempt. Shards then focuses the first invalid control.

The local COSS Form page was inspected in the in-app Browser. Both examples render native `FORM` elements with `novalidate`. A blank submit focuses the first invalid email control and connects its generated error through `aria-describedby`.

## parity fixture inventory

`apps/ui/src/lib/parity/components/form.svelte` reproduces both Form particles, `p-form-1` and `p-form-2`, with exact `id` and `data-particle` review selectors and the upstream full-width, `max-w-64` preview constraint. The second fixture preserves the Name/Age order, validation messages, 800 ms loading phase, external Form errors, focus behavior, and success alert text. Its local validation is behaviorally equivalent to the source Zod schema without adding a fixture-only package dependency. There are no dependency-gated Form particles. Registry entries and the full documentation page remain coordinator-owned.

## D6 documentation port

The D6 docs port freshly inspected both complete upstream particles and uses Zod 4 exactly for `p-form-2`: `z.coerce.number`, `safeParse`, and `z.flattenError` are preserved rather than replaced by ad hoc validation. The page keeps `p-form-1` as the usage example, `p-form-2` under “Using with Zod,” the API copy, loading details, success alert, and changelog.

Both particles and the displayed source compile and SSR render. The browser suite retains a native required-email submission regression for `p-form-1`.
