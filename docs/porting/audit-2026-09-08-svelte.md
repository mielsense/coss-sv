# Svelte quality audit — September 8, 2026

## Scope and source boundaries

This audit read every production Svelte and TypeScript file in the 19 component directories below
and compared each family with its registry source in `reference/apps/ui/registry/default/ui/`.
The corresponding port documentation pages were read for API accuracy. Matching local Shards
implementations were inspected for primitive behavior, state, types, and ref ownership. The
Number Field and Select repair lanes additionally read their complete upstream docs and importing
particles. No code was adapted from `reference/packages/ui/` or another AGPL-default directory.

The inventory excludes fixtures and tests. “Read” means source comparison; it does not claim that
every combination of states, screen sizes, themes, or keyboard paths received manual inspection.

| Family | Production files read | Result |
| --- | --- | --- |
| button | `button.svelte`, `index.ts` | No concrete defect established |
| checkbox | `checkbox.svelte`, `index.ts` | Late binding repaired |
| checkbox-group | `change-event-details.ts`, `checkbox-group-item.svelte`, `checkbox-group-root.svelte`, `context.ts`, `index.ts` | Runtime positive control; undefined binding type corrected |
| combobox | `combobox-chip-remove.svelte`, `combobox-chip.svelte`, `combobox-chips-input.svelte`, `combobox-chips.svelte`, `combobox-clear.svelte`, `combobox-empty.svelte`, `combobox-group-label.svelte`, `combobox-group.svelte`, `combobox-input.svelte`, `combobox-item.svelte`, `combobox-list.svelte`, `combobox-parts.svelte`, `combobox-popup.svelte`, `combobox-root.svelte`, `combobox-row.svelte`, `combobox-separator.svelte`, `combobox-status.svelte`, `combobox-trigger.svelte`, `combobox-value.svelte`, `context.svelte.ts`, `index.ts` | Late value/input/open bindings repaired; external selection label synchronization remains open |
| field | `field-control.svelte`, `field-description.svelte`, `field-error.svelte`, `field-item.svelte`, `field-label.svelte`, `field-relationship-provider.svelte`, `field-root.svelte`, `index.ts`, `reconcile-aria-relationship.ts`, `relationship-context.svelte.ts` | Native Control documentation corrected |
| fieldset | `context.svelte.ts`, `fieldset-legend.svelte`, `fieldset-root.svelte`, `index.ts` | No concrete defect established |
| form | `form.svelte`, `index.ts` | No concrete defect established |
| input | `index.ts`, `input-field.hydration-html.ts`, `input.svelte` | No concrete defect established |
| number-field | `context.ts`, `cursor-grow-icon.svelte`, `index.ts`, `number-field-decrement.svelte`, `number-field-field.hydration-html.ts`, `number-field-group.svelte`, `number-field-increment.svelte`, `number-field-input.svelte`, `number-field-machine.ts`, `number-field-root.svelte`, `number-field-scrub-area.svelte`, `number-field-step-button.svelte` | Canceled edits and native reset repaired; inherited form name remains a Shards limitation |
| otp-field | `context.ts`, `index.ts`, `otp-field-input.svelte`, `otp-field-machine.ts`, `otp-field-root.svelte`, `otp-field-separator.svelte`, `otp-field.hydration-html.ts` | No concrete defect established |
| radio-group | `index.ts`, `radio-group-item.svelte`, `radio-group-root.svelte` | Late binding repaired |
| select | `context.svelte.ts`, `index.ts`, `select-button.svelte`, `select-group-label.svelte`, `select-group.svelte`, `select-item.svelte`, `select-label.svelte`, `select-parts.svelte`, `select-popup.svelte`, `select-root.svelte`, `select-separator.svelte`, `select-trigger.svelte`, `select-value.svelte` | Object identity repaired; late value/open bindings repaired |
| separator | `index.ts`, `separator.svelte` | No concrete defect established |
| slider | `index.ts`, `slider-control.svelte`, `slider-indicator.svelte`, `slider-label.svelte`, `slider-root.svelte`, `slider-thumb.svelte`, `slider-track.svelte`, `slider-value.svelte` | Examples documentation corrected |
| switch | `index.ts`, `switch.svelte` | Late checked binding and documentation corrected |
| tabs | `context.ts`, `index.ts`, `tabs-change-details.ts`, `tabs-indicator.svelte`, `tabs-list.svelte`, `tabs-panel.svelte`, `tabs-root.svelte`, `tabs-styles.ts`, `tabs-tab.svelte`, `tabs-value.ts` | Late binding repaired |
| toggle | `group-change-context.ts`, `index.ts`, `toggle-variants.ts`, `toggle.svelte` | Late binding repaired |
| toggle-group | `change-event-details.ts`, `context.ts`, `index.ts`, `toggle-group-item.svelte`, `toggle-group-root.svelte`, `toggle-group-separator.svelte`, `toggle-group-styles.ts` | Late binding repaired |
| toolbar | `index.ts`, `toolbar-button.svelte`, `toolbar-group.svelte`, `toolbar-input.svelte`, `toolbar-link.svelte`, `toolbar-root.svelte`, `toolbar-separator.svelte`, `toolbar.types.ts` | No concrete defect established |

## Svelte findings and decisions

| ID | Category | Severity | Confidence | Evidence | Canonical owner / blocker |
| --- | --- | --- | --- | --- | --- |
| SV-01 | Reactive state | medium | high | Eight wrappers froze their displayed state source when an optional binding began undefined. Late parent writes were ignored. Dedicated browser regressions now cover boolean, scalar, array, input, and open state. | Wrapper derived state; no version blocker |
| SV-02 | Selection identity | medium | high | Select treated distinct same-label objects as the same item. Selecting the second Alex emitted the first object. Identity/comparer canonicalization now preserves the selected object. | Shared selection canonicalization; fixed in c89873a |
| SV-03 | Form state | medium | high | Number Field retained stale display/binding on native reset and showed rejected input after callback cancellation. | Number Field adapter; fixed in 68d430d |
| SV-04 | Form serialization | medium | high | Named Field around Number Field serializes both raw numeric and localized display text. Shards Field.Control prioritizes inherited name and offers no opt-out. | Shards primitive; unresolved, see Number Field evidence |
| SV-05 | Input synchronization | medium | high | A value-only external Combobox selection update changes Combobox.Value but leaves the visible input empty. The raw Shards positive control updates its label. | Wrapper always supplies inputValue; unresolved |

The inspected production files use TypeScript, runes, callback props, snippets, and typed native
attributes. Generated IDs use hydration-stable `$props.id()`. Mutable component state is scoped to
instances and context; this scope did not expose shared per-user server state or load-time writes.
Typed get/setContext helpers in older wrappers are not by themselves a correctness defect; no
wholesale rewrite was made. Existing controlled ownership and cancellable callback behavior stay
intact. In particular, Tabs keeps initial ownership detection for automatic fallback when a selected
tab is removed or disabled, while its displayed value reads late defined props.

Class forwarding and DOM wrapper differences were traced against the reference before filing
findings. For example, Combobox.Chip replaces its default class when the caller supplies one, as
the reference does; it was not changed. Shards removes chips by registered DOM index, so the docs'
string chip value is not evidence of an object-identity removal bug.

## Verification and limits

The binding lane passes 67 focused Chromium tests, 38 SSR/type tests, package `pnpm check` with zero
errors/warnings, and package build. The initial representative suite failed in nine cases; the
Combobox selection-specific assertion was separately run against the frozen implementation and
failed before restoring the repair. CheckboxGroup and the raw Shards input-label test are positive
controls. The private checkbox-group preview was inspected in the Codex in-app browser at 1280×800:
“Set late bindings” changed the checkbox to checked, selected the second toggle, and displayed
`true:second`. Existing default and controlled lifecycle tests remain green.

Default visual comparison coverage for the other 18 families is recorded in
`audit-2026-09-08-docs.md`; Number Field's source/target geometry and reset/cancellation inspection
are recorded in its component evidence. These checks establish the tested defaults and regression
paths, not exhaustive visual parity. Full repository gates belong to the integration coordinator.
