# Number field porting evidence

## Source boundary

- COSS revision: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Shards UI revision: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- COSS registry source: `reference/apps/ui/registry/default/ui/number-field.tsx`
- COSS documentation: `reference/apps/ui/content/docs/components/number-field.mdx`
- Shards source read in full: `packages/shardsui/src/lib/components/input/**`, `field/**`, `button/**`, and `select/**`
- Shards documentation read in full: `docs/src/content/input.md`, `field.md`, `button.md`, and `select.md`, including their demo directories and relevant tests
- Context7 was unavailable because the workspace quota was exhausted. This component therefore uses the pinned COSS source, the pinned local Shards implementation, and browser measurements from the published COSS page.

No source outside the MIT-designated `reference/apps/ui/**` subtree was used.

## Upstream API and particles

The React file exports `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `NumberFieldIncrement`, `NumberFieldDecrement`, `NumberFieldScrubArea`, `CursorGrowIcon`, `NumberFieldContext`, and `NumberFieldPrimitive`.

Fresh source search found these 20 direct particle consumers, all read completely:

- `p-number-field-1` through `p-number-field-11`
- `p-field-17`
- `p-group-14` and `p-group-22`
- `p-input-group-6`
- `p-slider-12`, `p-slider-13`, `p-slider-19`, `p-slider-21`, and `p-slider-22`

The documentation page presents ten examples: default, small, large, disabled, external label, scrub, range, currency formatting, decimal/integer steps, and form submission. `p-number-field-11` is a rounded particle that is registered but not linked from the page.

The other nine importing particles are also required fixtures. `p-field-17` combines a scrub area with Field description copy. `p-group-14` and `p-group-22` collapse Root and Group into one element through render delegation. `p-input-group-6` embeds the root directly in an Input Group with `€` and `EUR` addons. `p-slider-12`, `p-slider-13`, `p-slider-19`, `p-slider-21`, and `p-slider-22` bind Number Field values to horizontal, range, vertical, object-position, and price-distribution sliders.

## Rendered evidence

Automated headless Playwright inspection used `https://coss.com/ui/docs/components/number-field`; root will repeat final manual comparison in the Codex in-app browser.

- The default root is a `div[data-slot="number-field"][data-size="default"]`; the visual control is a `div[role="group"][data-slot="number-field-group"]`.
- At a 1280 px viewport the documented preview is 256 by 32 px. The small and large controls are 256 by 28 px and 256 by 36 px.
- The input is `type="text"`, `inputmode="numeric"`, `autocomplete="off"`, `autocorrect="off"`, `spellcheck="false"`, and has `aria-roledescription="Number field"`. At desktop it measures 178 by 30 px with 11 px inline padding, 14 px type, 30 px line height, centered text, and tabular numerals.
- Step buttons are native buttons with `tabindex="-1"`, `aria-label="Decrease"` or `"Increase"`, and `aria-controls` pointing at the input. They do not add stops to keyboard traversal.
- Arrow Up and Arrow Down step the focused input. Page Up and Page Down do nothing. Home and End move to finite bounds when supplied and do nothing without a matching bound. Input text may temporarily contain partial decimal or negative syntax. A wholly invalid edit is rejected immediately, so replacing `0` with `abc` keeps `0` visible.
- The root owns controlled or uncontrolled numeric state. It formats committed numbers with `Intl.NumberFormat`, parses locale decimal/group symbols, clamps stepping immediately, and clamps typed input when committed on blur or Enter.
- The root and buttons expose disabled data and native semantics. The input carries native name, required, invalid, read-only, form, and description attributes.
- The scrub label targets the generated or explicit field ID. Its outer element is a `span[role="presentation"]` with `touch-action: none`, `user-select: none`, and `data-slot="number-field-scrub-area"`. The nested design-system label retains its complete classes and `data-slot="label"`. The documented scrub fixture is 256 by 56 px at the desktop review width. Horizontal pointer movement steps the number while the custom grow cursor is displayed.

## COSS class contract

The port keeps the complete source class strings. Important tokens include the root `flex w-full flex-col items-start gap-2`; the group rounded input border, focus ring, invalid ring, light inset shadow, dark input surface, disabled opacity, and icon sizing; the 30/34/26 px responsive input heights; centered tabular text; and 11 px default or 9 px small inline padding. The buttons retain end-specific radii, hover accent, pointer-coarse 44 px hit targets, and embedded 18/16 px icon rules.

## Svelte and Shards mapping

Shards has no number-field component. `Input` is an alias for `Field.Control`; it supplies field label, description, invalid, disabled, name, value, and form registration. The port uses Shards `Input` inside a typed Svelte compound context. The local behavior layer owns locale parsing, numeric stepping, scrub state, and invalid edit rejection.

The Svelte API is namespace-first:

```svelte
<NumberField.Root bind:value defaultValue={0}>
  <NumberField.ScrubArea label="Quantity" />
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

Named compatibility exports remain available. React `onValueChange` becomes a typed callback prop, and `value` is deliberately bindable. React `format` maps directly to `Intl.NumberFormatOptions`; `locale` is explicit.

For the six upstream `render={<NumberFieldGroup />}>` compositions, Root accepts a typed `delegate` snippet. The snippet receives merged root props, the original children snippet, and the root ref attachment. Rendering those props through `NumberField.Group` produces one element with the group classes and root state attributes. It does not add a wrapper.

The private `p-group-14` parity fixture composes the audited Shards Select parts with the complete COSS Select wrapper classes. This fixture-local dependency must be replaced with the public C13 Select after coordinator integration; it does not add a second public Select API.

## Tests and review routes

Tests cover SSR, hydration, native attributes, ref and snippet forwarding, delegated single-element composition, locale parsing and formatting, decimal and negative partial input, min/max/step behavior, immediate invalid-text rejection, blur and Enter commit timing, supported keys, wheel opt-in and cancellation, controlled binding, invalid/disabled/read-only states, form submission and rejection, scrub pointer movement, and exact scrub DOM and geometry.

- Reference: `https://coss.com/ui/docs/components/number-field`
- Target: `/preview/number-field?theme=light&width=desktop`
- Target dark and narrow variants use the same route query contract.

Accepted deviations: none.
