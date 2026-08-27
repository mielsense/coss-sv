# OTP field porting evidence

## Source boundary

- COSS revision: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Shards UI revision: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- COSS registry source: `reference/apps/ui/registry/default/ui/otp-field.tsx`
- COSS documentation: `reference/apps/ui/content/docs/components/otp-field.mdx`
- Shards source read in full: `packages/shardsui/src/lib/components/input/**` and `field/**`
- Shards documentation read in full: `docs/src/content/input.md` and `field.md`, including demos and tests
- Context7 was unavailable because the workspace quota was exhausted. The pinned local implementations and published COSS page are the evidence base.

No source outside the MIT-designated `reference/apps/ui/**` subtree was used.

## Upstream API and particles

The React file exports `OTPField`, `OTPFieldInput`, `OTPFieldSeparator`, and `OTPFieldPrimitive`.

Fresh source search found nine direct particles, all read completely: `p-otp-field-1`, `p-otp-field-2`, `p-otp-field-3`, `p-otp-field-4`, and `p-otp-field-6` through `p-otp-field-10`. The missing `p-otp-field-5` is also absent from the upstream registry. The particles cover default and large slots, a visual separator, visible field labels, custom normalization and rejection feedback, controlled validation, alphanumeric codes, placeholders, and masking.

## Rendered evidence

Automated headless Playwright inspection used `https://coss.com/ui/docs/components/otp-field`; root will repeat final manual comparison in the Codex in-app browser.

- The root is `div[role="group"][data-slot="otp-field"]` and carries the accessible label. At desktop six default slots occupy 232 by 32 px; four large slots occupy 168 by 36 px. A separated six-slot field occupies 252 px.
- Every slot is a real `input[type="text"]`. Default slots measure 32 by 32 px at desktop with 14 px type, 32 px line height, 10 px radius, centered text, and an 8 px root gap. Large slots measure 36 by 36 px.
- The first slot carries `autocomplete="one-time-code"`, `maxlength` equal to root length, `tabindex="0"`, and the root label. Later slots use `autocomplete="off"` and `tabindex="-1"`. All use `autocorrect="off"`, `spellcheck="false"`, and a validation-specific `pattern`.
- Typing a valid character advances focus. Multiple inserted or pasted characters fill following slots. Arrow keys move focus. Backspace clears the current slot or moves backward when empty; Delete clears without moving backward. Selecting a slot and typing replaces it.
- Validation modes are `numeric`, `alpha`, `alphanumeric`, and `none`. `normalizeValue` runs before validation. Rejected characters call `onValueInvalid`; accepted changes call `onValueChange`. `onComplete` fires when the normalized value reaches `length`.
- `mask` changes slots to password inputs while keeping the same composition. Disabled fields expose native disabled inputs and root opacity. Read-only slots remain focusable but do not mutate.
- The root is controlled or uncontrolled, stores one string, exposes deliberate Svelte `bind:value`, and submits one hidden input when `name` is supplied so segmented slots do not submit duplicate values.

## COSS class contract

The complete source class strings are retained. The root uses an 8 px flex gap and disabled opacity. Slots retain size-responsive square geometry, rounded input border, light and dark surfaces, inset shadow, focus-visible z-index and 3 px ring, destructive invalid rings, centered type, and the upstream responsive 32/36 px desktop sizes. The visual separator is a horizontal 12 by 2 px rounded input-colored rule.

## Svelte and Shards mapping

Shards has no OTP primitive. Its input and field code establishes the native attribute, field labeling, invalid state, form, and attachment conventions. The port uses native inputs inside a typed compound context so DOM order defines slot order exactly as upstream does.

```svelte
<OTPField.Root bind:value length={6} aria-label="Verification code">
  <OTPField.Input />
  <OTPField.Input aria-label="Character 2 of 6" />
  <OTPField.Input aria-label="Character 3 of 6" />
  <OTPField.Separator />
  <OTPField.Input aria-label="Character 4 of 6" />
  <OTPField.Input aria-label="Character 5 of 6" />
  <OTPField.Input aria-label="Character 6 of 6" />
</OTPField.Root>
```

Named compatibility exports remain available. `value` is bindable; `onValueChange`, `onValueInvalid`, and `onComplete` are callback props. `length` stays required. Slot indices are assigned by DOM registration, not exposed as consumer props.

## Tests and review routes

Tests cover SSR, hydration, numeric, alpha, alphanumeric and custom normalization, full and partial paste, replacement, forward and backward focus movement, Backspace and Delete, disabled/read-only, input mode and autocomplete, completion callback, controlled binding, hidden form value, masking, invalid attributes, exact classes, and separator geometry.

- Reference: `https://coss.com/ui/docs/components/otp-field`
- Target: `/preview/otp-field?theme=light&width=desktop`
- Target dark and narrow variants use the same route query contract.

Accepted deviations: none.
