# Combobox port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/combobox.tsx`
- `reference/apps/ui/content/docs/components/combobox.mdx`
- `reference/apps/ui/registry/default/particles/p-combobox-1.tsx` through `p-combobox-20.tsx`

The registry wrapper, documentation page, and all twenty direct particles were read in full from the MIT-designated `reference/apps/ui/**` subtree. The importer inventory was checked for indirect combobox compositions. No source from the excluded COSS package subtree was used.

The particles cover sizes, disabled and invalid states, add-ons, clear and trigger controls, groups, object values, custom and async filtering, loading and empty states, controlled input text, single and multiple selection, chips, chip removal, and external anchors.

## Shards files inspected

The complete implementation and exported types under `shardsui/packages/shardsui/src/lib/components/combobox/`, the Combobox documentation and demos, and every Combobox test and fixture were inspected. Shards owns filtering, item identity, single and multiple state, active-descendant focus, keyboard behavior, chips, hidden form values, portal placement, and collection updates.

Current Svelte documentation was checked through Context7 alongside the pinned local Svelte Edge references. Chrome was not used.

## Translation decisions

- A typed Svelte context carries the chips element and multiple flag. `Combobox.Popup` uses the chips container as its default anchor exactly where the React wrapper used its context ref.
- Root state is deliberately bindable for `value`, `inputValue`, and `open`; Shards keeps ownership of selection identity, filtering, form serialization, and input synchronization.
- The standard input, chips input, chips frame, chip, and chip-removal parts preserve the exact COSS classes, icons, slots, and size behavior.
- The popup splits Portal, Positioner, outer frame, and primitive Popup props. Group, label, row, status, empty, separator, list, trigger, clear, value, and collection parts remain available as namespace and long-form exports.
- Single and multiple generic values remain intact. Selected object values are not reconstructed from display strings.
- Bare `Combobox.Clear` is an unstyled Shards wrapper with no invented child or accessible name. `Combobox.Input showClear` owns the COSS X icon and its `Clear` name; `clearProps` can override that composition. Chip removal retains its COSS `Remove` name.

## Verification targets

- single and multiple selection, exact object identity, chips, removal, repeated hidden form values, and input synchronization
- typed input, custom and async filtering, loading and empty states, groups, disabled options, active descendant, and keyboard navigation
- input and chips anchors, custom anchors, portal targets, placement variables, collision handling, and focus behavior
- exact sizes, slots, class strings, popup geometry, overflow treatment, invalid and disabled styling, and both themes

## Browser evidence

The Codex in-app Browser rendered all twenty particle sections. The default input group measured `256×32` pixels, the multiple example rendered its two initial chips, and both external-selection examples rendered two initial member rows. Typing `ora`, navigating to Orange, and pressing Enter closed the popup and synchronized the input to `Orange`. No external Chrome window was used.

## Repair verification

The repair reread the complete COSS wrapper, documentation page, all twenty particles, and the complete local Shards Combobox implementation, documentation, tests, fixtures, and types. SSR coverage distinguishes the bare clear part from the clear button composed by `Combobox.Input`. Browser coverage exercises single and multiple selection, synchronized input text, exact object identity, chip removal, repeated form values, and clearing the composed input.

The icon-authority repair replaces copied or representative trigger, clear, search, selection, and remove artwork with `@hugeicons/svelte` and matching free-core assets after rereading every affected COSS particle and Shards part. The parity trigger examples now include the icon supplied by COSS `SelectButton`. Source regression coverage rejects inline SVG and Lucide markup. The separator's stable public prop contract restores its generated declaration, and the built-package regression includes all six delegated Combobox parts.

## D8 documentation and particle port

The documentation lane freshly reread the complete permitted COSS Combobox MDX page, all 20 Combobox particles, every importing particle, and the complete local Shards Combobox source, documentation, demos, tests, fixtures, and types. The Svelte page preserves the source preview order `1–9, 13, 14, 10, 18, 11, 12` and the exact example copy. All 20 production modules retain the source data sets, including the complete country, team, group, async, object-value, chips, and externally controlled examples.

Source/SSR coverage imports and renders every module. Browser coverage verifies multiple selection and chip removal in normal and reduced-motion modes. The production-preview gate also asserts the exact `256px` preview constraint. In the Codex in-app Browser, the multiple example's chips input measured `71.98×24` pixels with `0 0 0 2px` padding, matching the corresponding COSS input. Chrome was not used. The coordinator-owned documentation manifest still needs to enroll `components/combobox`.
