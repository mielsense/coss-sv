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

The parity fixture represents all nine particles. In particular, `p-otp-field-4` retains the label, four-digit email copy, and centered Field layout. `p-otp-field-6` retains the Tier code normalizer, invalid pulse, live status copy, and cleanup timer. `p-otp-field-7` retains the exact `123456` validation states and messages.

## Rendered evidence

Automated headless Playwright inspection used `https://coss.com/ui/docs/components/otp-field`; root will repeat final manual comparison in the Codex in-app browser.

- The root is `div[role="group"][data-slot="otp-field"]` and carries the accessible label. At desktop six default slots occupy 232 by 32 px; four large slots occupy 168 by 36 px. A separated six-slot field occupies 252 px.
- Every slot is a real `input[type="text"]`. Default slots measure 32 by 32 px at desktop with 14 px type, 32 px line height, 10 px radius, centered text, and an 8 px root gap. Large slots measure 36 by 36 px.
- The first slot carries `autocomplete="one-time-code"`, `maxlength` equal to root length, and `tabindex="0"`. A root `aria-label` names the group only; it is not copied to the first slot. Later slots use `autocomplete="off"` and `tabindex="-1"`. All use `autocorrect="off"`, `spellcheck="false"`, and a validation-specific `pattern`.
- Inside a Field, the Field label names both the OTP group and the first slot. The Field description or error describes the group, not the first slot. Explicit ARIA relationships on either the root or an individual slot take priority over inherited relationships.
- Typing a valid character advances focus. Multiple inserted or pasted characters fill following slots. Arrow keys move focus. Backspace on a populated slot removes that character, shifts later values left, and focuses the previous slot. Backspace on an empty trailing slot removes the previous value and focuses it. Delete removes at the active position without moving backward. Selecting a slot and typing replaces it.
- Validation modes are `numeric`, `alpha`, `alphanumeric`, and `none`. Incoming whitespace is removed first, characters that already satisfy `validationType` are retained, `normalizeValue` is applied, the result is validated again, and Unicode code points are clamped to `length`. A same-length transform such as `a` to `A` is accepted without calling `onValueInvalid`. Initial, default, externally controlled, reset, and hydrated values use this normalization pipeline without reporting user-entry errors. Only rejected user input calls `onValueInvalid`; accepted changes call `onValueChange`. `onComplete` fires when the normalized value reaches `length`.
- `mask` changes slots to password inputs while keeping the same composition. Disabled fields expose native disabled inputs and root opacity. Read-only slots remain focusable but do not mutate.
- The root is controlled or uncontrolled, stores one string, exposes deliberate Svelte `bind:value`, and submits one hidden input when `name` is supplied so segmented slots do not submit duplicate values. Native form reset restores `defaultValue`. A `form` prop associates the slots and hidden value with an external form, including native required rejection.
- Slot identity is stable across mount, removal, remount, and DOM reordering. The root derives indices from registered element order instead of assigning a counter that can become stale.

## COSS class contract

The complete source class strings are retained. The root uses an 8 px flex gap and disabled opacity. Slots retain size-responsive square geometry, rounded input border, light and dark surfaces, inset shadow, focus-visible z-index and 3 px ring, destructive invalid rings, centered type, and the upstream responsive 32/36 px desktop sizes. The visual separator is a horizontal 12 by 2 px rounded input-colored rule.

## Svelte and Shards mapping

Shards has no OTP primitive. Its input and field code establishes the native attribute, field labeling, invalid state, form, and attachment conventions. The first slot uses Shards `Input` for Field registration. Later slots use native inputs so explicit per-slot labels are not overwritten by the shared Field label. A typed compound context derives slot position from live DOM order.

Shards applies Field message IDs to its control, while COSS applies them to the OTP group. The public Field wrappers publish their generated or explicit label and message IDs through a typed local context. The first OTP slot consumes and registers that context's default control ID; later slots retain unique IDs and never replace the label target. This makes a preceding Field label's `for` relationship complete during SSR and stable through hydration. Removing the first slot promotes the next live slot to the default ID, and a remounted first slot follows the same deterministic rule. A DOM attachment supplements the context for messages whose visibility is decided by Shards in the browser and observes dynamic replacement. The first slot removes only inherited Field relationships: an explicit `aria-label`, `aria-labelledby`, or `aria-describedby` remains authoritative. Shards still owns label activation and Field validation state through the first input primitive.

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

Named compatibility exports remain available. `value` is bindable; `onValueChange`, `onValueInvalid`, and `onComplete` are callback props. `length` stays required. Slot indices are derived from live DOM registration, not exposed as consumer props.

## Tests and review routes

Tests cover SSR, genuine server-to-client hydration HTML with no diagnostics, whitespace and invalid-character removal, Unicode length clamping, initial/default/controlled normalization without invalid callbacks, numeric, alpha, alphanumeric and custom normalization, full and partial paste, selection replacement, forward and backward focus movement, Backspace and Delete shifting, disabled/read-only, input mode and autocomplete, completion callback, controlled binding, normalized native submit/reset and external form association, dynamic slot removal/remount, masking, invalid attributes, Field label activation and message ownership in server and browser markup, explicit Field control IDs, explicit slot ARIA precedence, dynamic message replacement, exact classes, and semantic separator geometry.

- Reference: `https://coss.com/ui/docs/components/otp-field`
- Target: `/preview/otp-field?theme=light&width=desktop`
- Target dark and narrow variants use the same route query contract.

Accepted deviations: none.

## D6 documentation port

Fresh inspection covered all nine owned particles, `p-otp-field-1` through `p-otp-field-4` and `p-otp-field-6` through `p-otp-field-10`, plus the complete OTP Field page. The page preserves all nine previews in source order, exact labels and explanatory copy, normalization, separators, validation states, alphanumeric behavior, placeholder hints, masking, API prose, and changelog.

The auto-validation translation keeps the controlled COSS callback contract: `onValueChange` updates the parent value and invalid state, and the conditionally rendered Shards error uses `match={true}` so it is visible while the particle’s explicit invalid branch is mounted. Browser coverage types `654321`, verifies all six slot values, the exact error, roving Home focus, and password inputs for the masked example.
