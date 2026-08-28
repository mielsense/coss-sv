# Field port evidence

## source record

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Component and documentation: `reference/apps/ui/registry/default/ui/field.tsx` and `reference/apps/ui/content/docs/components/field.mdx`
- Field particles read in full: `p-field-1.tsx` through `p-field-18.tsx`
- Other importers read in full: all `p-card-*.tsx`; `p-form-1`, `p-form-2`, `p-fieldset-1`, `p-checkbox-5`, `p-checkbox-group-5`, `p-number-field-10`, `p-calendar-17`, `p-calendar-18`, `p-calendar-25`, `p-radio-group-5`, `p-radio-group-6`, `p-slider-2`, `p-slider-11`, `p-slider-14`, `p-slider-16`, `p-slider-23`, `p-sheet-1`, `p-sheet-2`, `p-select-11`, `p-input-18`, `p-textarea-6`, `p-textarea-11`, `p-textarea-12`, `p-drawer-8`, `p-drawer-10`, `p-drawer-12`, `p-autocomplete-13`, `p-otp-field-4`, `p-otp-field-6` through `p-otp-field-10`, `p-date-picker-3`, `p-dialog-1`, `p-dialog-3`, `p-dialog-4`, `p-dialog-6`, `p-combobox-11`, `p-combobox-12`, `p-popover-1`, and `p-switch-5`, all `.tsx`
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Shards files read in full: the complete `src/lib/components/field/` directory, every Field test and fixture, `docs/src/content/field.md`, and the Field hero demo

## contract and mapping

COSS defines styled Root, Label, Item, Description, and Error wrappers. Control and Validity remain direct behavioral parts. The Svelte port keeps that split. Shards owns generated IDs, label forwarding, message registration, validation, form errors, and field state. The wrappers add the exact COSS classes and `data-slot` values.

`Field.Root` accepts Shards validation and state props. `Field.Item` creates the nested label context used by checkbox and radio particles. `Field.Control` and `Field.Validity` are typed aliases to the installed Shards parts. Compatibility exports keep the COSS names such as `FieldLabel` and `FieldControl`.

`Field.Root` and `Field.Item` also accept `controlId`. Default COSS controls do not need it: the field allocates a hydration-stable ID and the first default control reuses it. Set `controlId` to the same value as an explicitly identified child control when the label renders before that child. This makes the server-rendered native `label[for]` relationship truthful before JavaScript runs; a later child cannot retroactively change HTML that the server has already emitted. Multiple controls follow Shards' registration order: the first remains the label target, removal falls through to the next control, and remounting appends after controls that stayed mounted.

COSS particles 13 and 14, Checkbox Group 5, and Radio Group 5 and 6 compose Field and Fieldset onto one root through React's `render` prop. The Svelte translation is `<Field.Root as="fieldset">`. Field.Root keeps the Shards Field context and establishes the local Fieldset legend context before rendering its children. The output has one `FIELDSET` with `data-slot="field"`, the merged Field classes, generated `aria-labelledby`, a native server-rendered `disabled` attribute when disabled, and no layout wrapper. Shards consumes the lowercase component prop for Field state, so the wrapper also passes a distinct uppercase spread key; Svelte and HTML normalize that valid case-insensitive native attribute to `disabled` in SSR and the DOM. `Fieldset.Legend` works in regular Fieldset roots and in this composed root.

## rendered evidence

The local COSS Field page was inspected in the Codex in-app Browser on August 27, 2026. The inspection covered every rendered example's accessible names, generated IDs, descriptions, errors, disabled states, checkbox and radio groups, select and textarea composition, and the exact wrapper classes. Submitting the Form example moved focus to the `email` input, set `aria-invalid="true"`, and linked the input to the generated error ID containing `Please enter a valid email.`

Focused SSR, type, hydration, and headless browser tests cover explicit and generated IDs, label activation, description and error relationships, invalid propagation, nested Item contexts, validation props, the one-root Fieldset mode, its native no-JavaScript disabled semantics, and the exported namespace.

## parity fixture inventory

`apps/ui/src/lib/parity/components/field.svelte` reproduces all ten currently ungated Field particles in source order: `p-field-1` through `p-field-6`, `p-field-10`, `p-field-12`, `p-field-15`, and `p-field-16`. Each particle has an exact `id` and `data-particle` review selector. The wrapper preserves the registry preview metadata: `p-field-1` through `p-field-6`, `p-field-10`, `p-field-12`, and `p-field-16` use the upstream full-width, `max-w-64` preview constraint; `p-field-15` has no registry width override. The validity particle keeps the live error and JSON state view, and the remaining fixtures preserve the source labels, copy, child order, disabled state, and integrated controls.

Eight Field particles remain dependency-gated after fresh import inspection: `p-field-7` requires Autocomplete; `p-field-8` and `p-field-9` require Combobox; `p-field-11` requires Select; `p-field-13` requires CheckboxGroup; `p-field-14` requires RadioGroup; `p-field-17` requires NumberField; and `p-field-18` requires Select. Those unfinished wrappers are not replaced inside the fixture.
