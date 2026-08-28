# Checkbox Group port evidence

## Source record

- COSS revision: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Shards UI revision: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- COSS component: `reference/apps/ui/registry/default/ui/checkbox-group.tsx`
- COSS Checkbox dependency: `reference/apps/ui/registry/default/ui/checkbox.tsx`
- COSS documentation: `reference/apps/ui/content/docs/components/checkbox-group.mdx`
- COSS component guide: `reference/apps/ui/skills/coss/references/primitives/checkbox-group.md`
- COSS Checkbox Group particles:
  - `reference/apps/ui/registry/default/particles/p-checkbox-group-1.tsx`
  - `reference/apps/ui/registry/default/particles/p-checkbox-group-2.tsx`
  - `reference/apps/ui/registry/default/particles/p-checkbox-group-3.tsx`
  - `reference/apps/ui/registry/default/particles/p-checkbox-group-4.tsx`
  - `reference/apps/ui/registry/default/particles/p-checkbox-group-5.tsx`
- Other COSS particles that import Checkbox Group:
  - `reference/apps/ui/registry/default/particles/p-field-13.tsx`
  - `reference/apps/ui/registry/default/particles/p-popover-4.tsx`
  - `reference/apps/ui/registry/default/particles/p-switch-7.tsx`
  - `reference/apps/ui/registry/default/particles/p-switch-8.tsx`
  - `reference/apps/ui/registry/default/particles/p-switch-9.tsx`
- Base UI 1.6.0 behavior sources:
  - `@base-ui/react/checkbox-group/CheckboxGroup.js` and `CheckboxGroup.d.ts`
  - `@base-ui/react/checkbox-group/CheckboxGroupContext.js` and `CheckboxGroupContext.d.ts`
  - `@base-ui/react/checkbox-group/useCheckboxGroupParent.js` and `useCheckboxGroupParent.d.ts`
  - `@base-ui/react/checkbox/root/CheckboxRoot.js` and `CheckboxRoot.d.ts`
  - `@base-ui/react/internals/createBaseUIEventDetails.js` and `createBaseUIEventDetails.d.ts`
- Complete Shards Checkbox Group implementation:
  - `shardsui/packages/shardsui/src/lib/components/checkbox-group/checkbox-group-root.svelte`
  - `shardsui/packages/shardsui/src/lib/components/checkbox-group/checkbox-group.svelte.ts`
  - `shardsui/packages/shardsui/src/lib/components/checkbox-group/context.ts`
  - `shardsui/packages/shardsui/src/lib/components/checkbox-group/index.ts`
- Complete Shards Checkbox implementation:
  - `shardsui/packages/shardsui/src/lib/components/checkbox/checkbox-root.svelte`
  - `shardsui/packages/shardsui/src/lib/components/checkbox/checkbox-indicator.svelte`
  - `shardsui/packages/shardsui/src/lib/components/checkbox/context.ts`
  - `shardsui/packages/shardsui/src/lib/components/checkbox/index.parts.ts`
  - `shardsui/packages/shardsui/src/lib/components/checkbox/index.ts`
- Shards documentation and demos:
  - `shardsui/docs/src/content/checkbox-group.md`
  - `shardsui/docs/src/content/checkbox.md`
  - `shardsui/docs/src/lib/components/content/demos/checkbox-group/hero/demo.svelte`
  - `shardsui/docs/src/lib/components/content/demos/checkbox/hero/demo.svelte`
- Complete Shards Checkbox Group tests:
  - `shardsui/packages/shardsui/tests/checkbox-group/checkbox-group.test.ts`
  - every fixture under `shardsui/packages/shardsui/tests/checkbox-group/fixtures/`: `all-disabled-invalid-focus.svelte`, `basic-checkbox-group.svelte`, `checkbox-group-error-described-by.svelte`, `checkbox-group-form-error.svelte`, `checkbox-group-form-submit.svelte`, `checkbox-group-validate-submit.svelte`, `controlled-checkbox-group.svelte`, `declining-plain-checkbox-group.svelte`, `disabled-precedence-checkbox-group.svelte`, `disabled-representative-focus.svelte`, `duplicate-registration-submit.svelte`, `empty-group-validate.svelte`, `empty-value-checkbox-group.svelte`, `explicit-label-checkbox-group.svelte`, `field-custom-disable-toggle.svelte`, `field-custom-toggle.svelte`, `field-label-checkbox-group.svelte`, `field-required-disabled.svelte`, `field-required-mode.svelte`, `field-required-two.svelte`, `field-required-unmount.svelte`, `field-validation-checkbox-group.svelte`, `fieldset-disabled-focus.svelte`, `form-owner-change.svelte`, `form-required-external.svelte`, `form-values-disabled.svelte`, `form-values-external.svelte`, `form-values-fieldset.svelte`, `form-values-implicit-name.svelte`, `form-values-unmount.svelte`, `group-description-checkbox-group.svelte`, `id-checkbox-group.svelte`, `inputless-custom-error.svelte`, `inputless-invalid-focus.svelte`, `inputless-on-change.svelte`, `inputless-validation-mode.svelte`, `invalid-checkbox-focus.svelte`, `portaled-checkbox-form-attr.svelte`, `portaled-checkbox-form.svelte`, `portaled-external-form-checkbox.svelte`, `portaled-group-form.svelte`, `portaled-required-checkbox.svelte`, `revalidate-external-checkbox-group.svelte`, `undefined-value-checkbox-group.svelte`, `unmount-all-required.svelte`, `unmount-all-validate.svelte`, `unmount-first-focus.svelte`, and `unmount-validation-mode.svelte`
- Complete Shards Checkbox tests:
  - `shardsui/packages/shardsui/tests/checkbox/checkbox-root.test.ts`
  - `shardsui/packages/shardsui/tests/checkbox/checkbox-indicator.test.ts`
  - every fixture under `shardsui/packages/shardsui/tests/checkbox/fixtures/`: `basic-checkbox.svelte`, `button-checkbox.svelte`, `checkbox-enter-animation.svelte`, `checkbox-exit-animation.svelte`, `checkbox-external-errors.svelte`, `checkbox-group-filled.svelte`, `checkbox-implicit-field-label.svelte`, `checkbox-in-field.svelte`, `checkbox-indicator-props.svelte`, `checkbox-native-validation.svelte`, `checkbox-revalidate-external.svelte`, `checkbox-sibling-label.svelte`, `checkbox-validation.svelte`, `checkbox-veto.svelte`, `checkbox-with-field-label.svelte`, `click-propagation-checkbox.svelte`, `controlled-checkbox.svelte`, `described-by.svelte`, `empty-id-checkbox.svelte`, `external-form.svelte`, `form-disabled-submit.svelte`, `form-no-submit.svelte`, `form.svelte`, `indicator-outside-root.svelte`, `linked-label-checkbox.svelte`, `native-form.svelte`, and `wrapping-label-checkbox.svelte`

All files above were read directly for this port. No file under `reference/packages/ui/**` was used.

## COSS contract

COSS exports `CheckboxGroup` plus the unstyled Base UI primitive. The styled root renders a `div` with `role="group"` and merges consumer classes after `flex flex-col items-start gap-3`.

The public state contract includes:

- `defaultValue` for an uncontrolled initial selection;
- `value` and `onValueChange` for controlled selection;
- `allValues` for a parent checkbox;
- `disabled` inheritance;
- native group attributes, accessible labels, descriptions, and ref forwarding.

A parent checkbox controls the values in `allValues`. It has `data-parent`, points `aria-controls` at the child inputs, becomes checked when every available value is selected, and becomes indeterminate when only some values are selected. Selecting through the parent skips disabled unchecked items. Clearing through the parent preserves disabled checked items. Nested parent groups keep separate value arrays and synchronize through the consumer callbacks shown in `p-checkbox-group-4`.

`onValueChange` receives the next value and a Base UI-compatible details object. The details expose `reason`, `event`, `trigger`, `cancel()`, `allowPropagation()`, `isCanceled`, and `isPropagationAllowed`. Checkbox Group creates these details from the native event with reason `none` and no trigger, matching Base UI's group callback. Calling `cancel()` suppresses both the value write and the parent status write. A rejected Svelte function binding has the same visible result: Shards restores the checkbox and hidden form-input state to the last accepted value.

Checkboxes keep their normal independent keyboard model. Tab follows DOM order, Space toggles the focused checkbox, and disabled items leave the focus order. The group does not use roving focus or arrow-key selection.

## Rendered reference measurements

The running COSS page at `/ui/docs/components/checkbox-group` was inspected at desktop and narrow widths. The root uses `display: flex`, `flex-direction: column`, `align-items: flex-start`, and a `12px` gap in both themes. The examples measured:

| Particle | Root size at desktop | States |
| --- | --- | --- |
| `p-checkbox-group-1` | `70.9297px × 72px` | Next.js checked |
| `p-checkbox-group-2` | `70.9297px × 72px` | Next.js checked, Vite disabled |
| `p-checkbox-group-3` | `106.4766px × 100px` | parent plus three indented children |
| `p-checkbox-group-4` | `150.0469px × 212px` | outer parent, nested parent, seven leaf items |
| `p-checkbox-group-5` | `70.9297px × 72px` | field and form composition, Next.js checked |

Labels use the existing COSS `Label` or `Field.Label` typography and an `8px` inline gap. Leaf indentation uses `ms-4`, which resolves to `16px`. Checkbox visuals come from the existing COSS Checkbox wrapper. Checkbox Group adds no theme-specific color, border, shadow, or motion.

## Shards translation

`CheckboxGroup.Root` wraps Shards `CheckboxGroup`. Shards supplies the group role, function value binding, disabled propagation, field state, description merging, form projection, validation registration, and native state restoration after a rejected write. The wrapper adds the COSS layout class, Base UI-compatible `defaultValue`, cancellable two-argument `onValueChange`, and the parent-checkbox behavior that Shards does not expose.

`CheckboxGroup.Item` wraps the existing styled COSS Checkbox. Ordinary items stay registered with the Shards group through the Shards Checkbox context and report their current disabled state to the wrapper. Items with `parent` read the COSS group context, derive checked and indeterminate state from `allValues`, and write the eligible selection through the root. Parent items forward `form` and `required` to their hidden input but omit `name`, matching Base CheckboxRoot. Stable child input IDs come from `$props.id()` on the root, so parent `aria-controls` matches during server rendering and hydration.

The root commits every child and parent interaction through one function-binding boundary. It captures the originating click event, creates fresh triggerless change details, invokes `onValueChange`, and writes only when the callback does not cancel. After assignment, it reads the binding getter and advances parent status only when the getter accepted the exact array. This keeps cancellation and rejected function bindings consistent for visible checkboxes, hidden native inputs, and repeated parent interactions.

Particle 5 maps the React render prop to one `<Field.Root as="fieldset">`. Its `FieldsetLegend` and Checkbox Group are direct children; Field owns the Fieldset composition context, so no bridge element or second labelled owner is introduced.

The root context is typed with `createContext`. Its state is scoped to one rendered group and never stored at module scope.

## Intentional Svelte API translation

Compound usage follows the project namespace convention:

```svelte
<CheckboxGroup.Root allValues={["next", "vite"]} bind:value>
  <CheckboxGroup.Item parent aria-label="Frameworks" />
  <CheckboxGroup.Item value="next" aria-label="Next.js" />
  <CheckboxGroup.Item value="vite" aria-label="Vite" />
</CheckboxGroup.Root>
```

`CheckboxGroup` remains an alias for `CheckboxGroup.Root`. Existing `Checkbox` children still work for groups that do not need a parent. The parent feature uses `CheckboxGroup.Item parent` because Shards owns Checkbox context internally and its Checkbox props do not contain Base UI's `parent` prop. This changes component composition, not rendered behavior.

## Particle inventory and gates

The parity fixture includes all five Checkbox Group documentation particles with the same copy, ordering, values, checked states, disabled state, indentation, field structure, form button, 800 ms loading state, and selection alert.

- `p-checkbox-group-1`: included.
- `p-checkbox-group-2`: included.
- `p-checkbox-group-3`: included with the parent Item translation.
- `p-checkbox-group-4`: included with nested Root and parent Item translation.
- `p-checkbox-group-5`: included.

Additional consumer particles are not Checkbox Group documentation examples. `p-field-13` can use the same root today. `p-popover-4` waits for Popover. `p-switch-7`, `p-switch-8`, and `p-switch-9` wait for Combobox, Popover, Select, and Tooltip.

## Tests and review routes

- SSR and export tests: `packages/ui/src/components/ui/checkbox-group/checkbox-group.test.ts`
- Type tests: `packages/ui/src/components/ui/checkbox-group/checkbox-group.types.test.ts`
- Browser, keyboard, disabled parent select/clear, triggerless cancellation, rejected child and repeated-parent bindings, parent form/required projection, nested-parent, and form tests: `packages/ui/src/components/ui/checkbox-group/checkbox-group.browser.test.ts`
- Real built-route SSR-to-hydration stable-ID and submit-side-effect tests: `tests/e2e/checkbox-group.spec.ts`
- Deterministic fixture: `apps/ui/src/lib/parity/components/checkbox-group.svelte`
- Target route: `/preview/checkbox-group?theme=light&width=desktop`
- Reference route: `/ui/docs/components/checkbox-group`

Accepted visual or behavioral deviations: none.

## D5 documentation port

The D5 lane re-read the complete Checkbox Group MDX page, particles `p-checkbox-group-1` through `p-checkbox-group-5`, the target group context, and the complete matching local Shards source, tests, docs, and examples. The page keeps all five preview IDs and order. Its Svelte usage sample treats `CheckboxGroup.Item` as the control and wraps it with `Label`; it does not nest a second `Checkbox`. The weekly copy editor follows the same item-owned-control contract. The form example prevents native navigation and captures its selected framework before the loading wait; component and built-preview tests assert `Selected: next` and an unchanged query. The live upstream page exposed 5 previews at 1440px; at 390px its h1 was x=16, y=88, 358×36 with no horizontal overflow. The nested example is implemented with the target group context; the coordinator-owned shared metadata index is the remaining route-discovery seam.
