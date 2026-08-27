# Radio Group port evidence

## source record

- Pinned COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Component: `reference/apps/ui/registry/default/ui/radio-group.tsx`
- Documentation: `reference/apps/ui/content/docs/components/radio-group.mdx` and `reference/apps/ui/content/docs/components/segmented-control.mdx`
- Radio Group particles read in full: `p-radio-group-1.tsx` through `p-radio-group-9.tsx`
- Other complete importer read: `p-field-14.tsx`
- Shared COSS helper read in full: `reference/apps/ui/registry/default/lib/segmented-control.ts`
- Pinned Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Shards implementation read in full: every file in `shardsui/packages/shardsui/src/lib/components/radio-group/` and `shardsui/packages/shardsui/src/lib/components/radio/`
- Shards tests read in full: `radio-group.test.ts`, `radio-root.test.ts`, `radio-indicator.test.ts`, and every fixture under `shardsui/packages/shardsui/tests/radio-group/fixtures/` and `shardsui/packages/shardsui/tests/radio/fixtures/`
- Shards API material read in full: `shardsui/docs/src/content/radio.md`, its hero demo, and the installed `@shardsui/svelte@0.1.0-beta.0` declarations for Radio and RadioGroup

All COSS evidence came from the MIT-designated `reference/apps/ui/**` subtree. No source under `reference/packages/ui/**` was used.

## COSS contract

The styled root adds `flex flex-col gap-3` and `data-slot="radio-group"`. Each item is an 18px circular control that becomes 16px at the `sm` breakpoint. The item keeps COSS's border, background, inset shadow, focus ring, invalid state, disabled opacity, and dark-theme selectors without rewriting them as component state.

The indicator stays mounted. Its `data-unchecked:hidden` class hides the dot while preserving the same DOM shape in checked and unchecked states. A checked item uses the primary background with a primary-foreground center dot. The wrapper exports the styled root and item, the `RadioGroupItem` compatibility alias, and both Shards namespaces used by the segmented-control particles.

The nine documentation particles cover ordinary labels, a disabled item, explicit labels with descriptions, card labels, Form and Field composition, visual theme cards, and three segmented-control sizes. `p-field-14.tsx` is the only other Radio Group importer in the permitted reference tree.

## Shards behavior and Svelte mapping

Shards supplies `role="radiogroup"`, radio roles and checked state, one roving tab stop, arrow-key selection with disabled-item skipping and wrapping, Space activation, Enter suppression, disabled and read-only behavior, label resolution, hidden native radio inputs, form names and values, required state, callback handling, Field and Fieldset state, generated IDs, and SSR-safe state attributes.

The Svelte port maps the API this way:

- `RadioGroup.Root` is the styled root. `RadioGroup`, `RadioGroupRoot`, and `Root` name the same component.
- `RadioGroup.Item` is the styled radio. `Radio`, `RadioGroupItem`, and `Item` name the same component.
- `RadioGroup.RadioGroupPrimitive` and `RadioGroup.RadioPrimitive` expose the unstyled Shards parts needed by the segmented-control examples.
- `defaultValue` snapshots the initial value once. `value` and `bind:value` follow the Shards Svelte contract. `onValueChange` receives the selected generic value.
- Both wrappers use `$props()`, deliberate bindable props, a function binding for the initial-value bridge, derived class merging, forwarded native attributes, and typed generic values. They contain no legacy Svelte syntax.

## parity fixture

`apps/ui/src/lib/parity/components/radio-group.svelte` reproduces `p-radio-group-1` through `p-radio-group-9` in source order. It keeps the exact visible copy, item order, disabled state, descriptions, card classes, form width, theme preview SVG paths, and segmented-control classes for the small, default, and large examples. Each example has its original `data-particle` name and no dependency gate.

The React `render` composition in particles 5 and 6 becomes `<Field.Root as="fieldset">`. Field owns the Fieldset composition context, so `FieldsetLegend` and the Radio Group render as direct children without a bridge element. Hydration-stable legend IDs label the single outer fieldsets and are passed to the Radio Groups through `aria-labelledby`. The Field name is passed to RadioGroup because Shards puts native radio names on the group. The raw Base UI `defaultValue` in particles 7 through 9 becomes Shards' initial `value` prop. These are structural and API translations only; the visible examples stay the same.

In dark mode, the exact COSS `not-peer-data-checked:text-muted-foreground/70` class on the two unchecked p6 labels inherits an upstream automated contrast failure. The target and reference use the same class and the same `--background` and `--muted-foreground` tokens. Built-route coverage disables only axe's `color-contrast` rule for p6 in dark mode; every other axe rule remains active, and light mode runs the complete ruleset. The port does not change the reference color.

`p-field-14.tsx` belongs to the Field documentation inventory. The Radio Group port removes that fixture's dependency gate once the coordinator integrates the shared export and parity index.

## verification

- SSR coverage checks the exact root, item, and indicator classes; slots; checked and unchecked state attributes; hidden form inputs; custom classes; and export aliases.
- Type coverage checks generic value unions, `defaultValue`, `value`, callbacks, form props, native event props, refs, and snippets.
- Headless browser coverage checks accessible names and roles, uncontrolled defaults, binding, callbacks, native form values, required state, refs, roving focus, arrow selection, disabled-item skipping, wrapping, Space, Enter, group disablement, read-only state, cancelled consumer clicks, rejected function bindings, and hydration warnings. Built-route coverage also checks both legend-derived group names, the single-fieldset DOM without a context bridge, a clean browser console, and the delayed `Selected: <value>` submit alert from the value captured before loading begins.
- The coordinator still needs to repeat the manual light, dark, responsive, focus, keyboard, and motion comparison in the Codex in-app Browser after adding the shared package export and parity entry. No Chrome substitute was used.
