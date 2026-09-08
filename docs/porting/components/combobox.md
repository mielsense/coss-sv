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

## Reactive object selection repair

The upstream multiple example keeps selected options in the popup, exposes them with `aria-selected="true"`, and toggles a selected option off when it is pressed again. The Svelte particle initially rendered the same chips, but its `$state` array wrapped object values in proxies. Shards compares values with `Object.is` by default, so the popup treated the proxied selections as unselected and appended a duplicate when one was pressed again. The duplicate then collided with the particle's keyed chip rendering.

Svelte does not expose a public way for a component to recover an object's original identity from a deep-state proxy. The five object-valued multiple particles therefore keep their selection arrays in `$state.raw`, which remains reactive on assignment without proxying the item objects. Consumers that need deep state can instead provide `isItemEqualToValue`; the wrapper now treats that comparator as authoritative and keeps `{ label, value }` Combobox items intact during outgoing change normalization. Multiple mode also accepts Shards' controlled `null` value without calling array methods on it.

Browser coverage verifies the raw-state toggle, duplicate labels with an explicit ID comparator, controlled `null`, selection after a bound reassignment, and the production particle preview. The registry publishes the same corrected particle source shown in the documentation.

## September 8 binding audit

The complete wrapper source was compared with the permitted COSS registry implementation and the
matching local Shards root. The wrapper must observe a Svelte binding that starts undefined and
receives a defined value later. Initial controlled-state detection previously selected the
internal fallback forever. The rendered value now reads the current prop when it is defined,
while initial ownership still governs internal updates. This preserves controlled cancellation
and the existing uncontrolled lifecycle; Tabs retains automatic fallback when a tab disappears.

`checkbox-group/undefined-bindings.browser.test.ts` covers boolean, scalar, array, input-text, and
open bindings. `select/select-undefined.browser.test.ts` covers late value/open updates and clearing
a selection. The tests reproduce the stale state before the correction. CheckboxGroup already
handled late values correctly and remains a positive control; its only change explicitly permits
undefined in the binding type under `exactOptionalPropertyTypes`. Other affected optional binding
types now permit undefined as well.

A separate comparison with the raw Shards primitive established a label synchronization
issue: setting only `value` externally updates `Combobox.Value`, but the wrapper input stays empty.
The primitive updates the input label when `inputValue` is omitted. The wrapper always supplies
its internal input string to support cancellable input changes, suppressing that primitive path.
The binding regression asserts selection and independently tests `inputValue`; it does not claim
to repair label synchronization. The raw primitive comparison is retained as evidence; the
follow-up below repairs this separate defect.

## September 8 selected input label follow-up

Fresh inspection reread the complete permitted Combobox registry and documentation, the wrapper
root/input/popup/context, and Shards root, input, selection watchers, and label serialization.
Earlier source inventory and particle comparisons remain recorded above. Shards synchronizes a
selected value to an outside single input only when its input text is uncontrolled. The wrapper
always supplied input text to preserve cancellable callbacks, disabling that primitive path.

The new regressions failed with an empty initial selected label and with `ora` still visible after
an external selection changed to Banana. Separate regressions found that canceled typing left
rejected native text visible and that canceling an empty input still cleared the selection.

The wrapper now records input placement through typed per-instance context, including popup and
inline inputs. A narrow effect reconciles the two separately owned primitive states only when an
outside single selection changes or its input first mounts. It preserves typed queries between
selection changes, explicit default input text, and independent input control. Comparing external
input writes with the last wrapper write distinguishes a later controlled input from the wrapper's
own binding updates. The effect also delivers the cancellable `none` input-change callback for
external selection changes; initial label display emits no callback. This bridge retains primitive
cancellation instead of handing text ownership back to a primitive setter that cannot cancel it.

Canceled native input restores the event target's accepted text. Its event-scoped guard also
suppresses the primitive's ensuing selection clear, then releases in a microtask. This does not
change a later independent selection event. No module-global mutable state, DOM search for popup
placement, shared helper edit, or primitive dependency patch was introduced.

Validation covers initial/default selections, custom object labels, external selection and clear
after typing, initial and late independent input control, explicit default query, multiple/chips
(including nested object formatters), popup search, inline search, canceled typing, and canceled
clearing. All 31 focused browser tests (including existing Combobox and late-binding coverage) and
9 Combobox SSR/type tests pass. Package check reports zero errors and warnings; package build,
focused Biome, Prettier, and diff checks pass.

The Codex in-app browser on port 5109 observed initial Apple, external Banana, external clear to
empty/null, and rejected input restored to Accepted. Existing disabled and timezone fixtures now
display Orange and (GMT+01:00) Paris. This pass used DOM evaluation for these state transitions;
the snapshot returned a blank image and the previous reference server was unavailable, so no new
screenshot or live-reference approval is claimed.

Audit contract: combobox-selected-input-label; correctness; medium severity; high confidence;
canonical owner: Shards input/selection separation and Svelte Edge runes/context guidance.
No version or flag blocker. The previous selected-label limitation is resolved for the public
Combobox Input composition.

The final pass also adds two red-to-green SSR regressions. Public Input now seeds its native
value from the initial selected label or the explicit input/default query, using the same typed
placement context to leave popup/inline search empty. Shards retains live text ownership after
mount. This gives server-rendered inputs their selected labels without running an effect on the
server. The SSR tests assert the native value attribute. The private preview renders this fixture
on the client, so its page response was not used as SSR evidence. In-app inspection verified the
mounted input showed Apple and an external update changed it to Banana. The canceled-clear
regression also enables input afterward and selects Banana, checking the event guard does not
suppress a later selection.

The parity review added an items-refresh regression based on Shards' `value-stale-items` fixture:
a selected raw object's label is changed in place, then the items array is replaced. The raw
primitive refreshed its outside input, while the first repair retained the old label. The
follow-up observes the items collection and records accepted native input edits. A label-only
refresh preserves an active query, including typing App and then Apple. A new selection or the
primitive's close-complete callback clears that query history. Eight comparative browser tests
cover both the raw primitive and wrapper, including close/reopen and callback forwarding.

A separate browser regression inserts the actual retained SSR output, verifies Apple before
hydration, hydrates with recovery disabled, edits the query, and applies external Banana. It also
checks for hydration warnings. An SSR test compares the retained HTML with current server output,
so the hydration fixture cannot silently become stale. The complete focused browser set contains
43 passing tests; SSR/type contains 10. Package check/build and focused format/lint checks pass.

The final Svelte review reproduced an IME-specific query-history gap: Shards commits composition
on `compositionend`, after the prepared input event has expired. The wrapper now prepares that
native event through the existing change context and records an accepted composition as a query
edit. Comparative tests dispatch composition start, composing input, a microtask, and composition
end before refreshing items. Shards preserved the composed text while the wrapper failed before
the fix. A further regression verifies cancellation restores the accepted label, preserves the
native composition callback, and still permits a later label refresh.
