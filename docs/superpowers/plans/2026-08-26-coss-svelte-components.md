# COSS for Svelte Component Port Plan

> This plan uses concurrent implementation lanes and independent concurrent reviewers. It does not use the Superpowers subagent-driven-development skill.

**Goal:** Port all 54 COSS registry components to canonical, idiomatic Svelte 5 components in `packages/ui`, using Shards UI for matching headless behavior and proving visual, interaction, accessibility, and API parity against the running React reference.

**Architecture:** Each component lives in an isolated directory with a local barrel, tests, a deterministic parity fixture, and a porting evidence record. Shards provides behavioral parts. COSS registry source supplies styling and observable behavior. Coordinator-owned aggregate exports, registry manifests, shared tokens, and lockfiles are updated only after a component lane passes both reviews.

**Prerequisite:** The repository foundation plan is complete and green.

**Specification:** `docs/specs/2026-08-26-coss-svelte-port-spec.md`

## Non-negotiable task contract

Every component row below becomes a self-contained implementation brief. The implementation agent must perform these steps in this order for each named component, even if it worked on a related component earlier.

### Implementation agent procedure

1. Freshly read the complete COSS registry file listed in the row.
2. Freshly read `reference/apps/ui/content/docs/components/<component>.mdx` when present. For `calendar`, also read `date-picker.mdx`; for grouped controls, read every composition page that uses them.
3. Enumerate particle files with a source search for imports from the component and read every matched file completely. Do not rely on filenames or a previous inventory summary.
4. Run the relevant upstream particles from `reference/apps/ui` and inspect DOM, computed styles, CSS variables, theme states, focus behavior, keyboard behavior, pointer behavior, animation, and responsive layout.
5. Freshly read the complete local Shards source and documentation paths listed in the row, including types, tests, examples, and any file re-exported by the component directory.
6. Write `docs/porting/components/<component>.md` before implementation. Record exact source paths, commits, exports, parts, props, variants, classes, examples, DOM, ARIA, keyboard interactions, state behavior, animation, and a proposed Svelte mapping.
7. Write failing behavior and typing tests from that evidence.
8. Implement the smallest native Svelte 5 wrapper or composition that satisfies the evidence. Preserve COSS class strings and tokens unless Svelte/Shards requires a documented structural translation.
9. Add `apps/ui/src/lib/parity/components/<component>.svelte` with deterministic states needed for browser review. This is a review fixture, not a replacement for the 508 documentation particles.
10. Run component tests, package checks, SSR/hydration smoke tests, and the component parity route.
11. Commit with the exact lowercase subject assigned to the lane and provide a handoff containing the inspected paths, tests, reference URLs, target URLs, known risks, and commit SHA.

If the listed Shards primitive is absent, “there is no Shards implementation” is not enough. The agent must read the listed nearest Shards primitives and explain the local behavior layer.

### Parity and accessibility reviewer procedure

The reviewer must not accept the implementation agent's evidence as a substitute for inspection.

For every component in the lane, the reviewer must:

1. Freshly read the listed COSS registry file, documentation page, and every importing particle.
2. Freshly read the listed Shards source, docs, types, tests, and examples.
3. Run both the React reference and Svelte parity fixture in the in-app browser.
4. Compare light and dark themes plus desktop and narrow widths.
5. Exercise all applicable states: default, hover, active, focus-visible, disabled, invalid, checked, selected, open, closed, indeterminate, loading, destructive, and reduced motion.
6. Exercise pointer and full keyboard behavior, including focus entry, traversal, escape, dismissal, selection, typeahead, and focus restoration.
7. Compare DOM semantics, accessible names, roles, properties, relationships, live regions, portal behavior, and axe output.
8. Compare bounding boxes and computed CSS values for any visible discrepancy. Screenshots alone are not sufficient.
9. Verify the evidence record against the actual files and record exact findings with source references and measurements.
10. Approve or reject the exact implementation commit.

### Svelte quality reviewer procedure

For every component in the lane, this reviewer freshly reads the target and matching Shards types, then checks:

- Svelte 5 runes, snippets, callback props, context, and generics are idiomatic;
- no `export let`, `<slot>`, `on:`, `createEventDispatcher`, legacy stores, or legacy `{@const}` remain;
- props, native attributes, callbacks, refs, actions, attachments, and snippets are forwarded correctly;
- controlled and bindable state is explicit and type-safe;
- SSR, hydration, portals, and generated IDs are safe;
- local barrels expose stable, tree-shakeable names;
- tests assert behavior rather than internal rune state;
- dependencies and abstractions are minimal;
- the exact implementation commit is reviewable without uncommitted changes.

Both reviewers run concurrently. Both approvals are required. Any fix invalidates the affected approval and receives a focused re-review.

The current runtime has three worker slots in addition to the coordinator. At the start of a wave, run three implementation lanes. When the first lane is ready, assign two workers to its reviews and keep one implementation lane active. Refill freed slots from the ready queue immediately. This preserves concurrent implementation and review within the available capacity.

## Shared file ownership

Only the coordinator edits:

- `packages/ui/src/index.ts`
- `packages/ui/src/styles/globals.css`
- `apps/ui/registry/registry-ui.ts`
- root and workspace package manifests
- `pnpm-lock.yaml`
- generated aggregate parity indexes

Each lane owns only:

- `packages/ui/src/components/ui/<assigned-component>/**`
- `apps/ui/src/lib/parity/components/<assigned-component>.svelte`
- `docs/porting/components/<assigned-component>.md`

If a component needs a shared token, dependency, preview helper, or registry rule, the agent requests it in the handoff. It does not edit the shared file.

## Component source matrix

Every path in the “COSS source” column is under the MIT-designated `reference/apps/ui/**` subtree. “Native” means no direct Shards component exists; the listed Shards paths are still mandatory fresh reading.

| Component | COSS source | Mandatory local Shards reading | Target directory |
| --- | --- | --- | --- |
| accordion | `reference/apps/ui/registry/default/ui/accordion.tsx` | `shardsui/packages/shardsui/src/lib/components/accordion/**`, `shardsui/docs/src/content/accordion.md` | `packages/ui/src/components/ui/accordion/` |
| alert-dialog | `reference/apps/ui/registry/default/ui/alert-dialog.tsx` | `shardsui/packages/shardsui/src/lib/components/alert-dialog/**`, `shardsui/docs/src/content/alert-dialog.md` | `packages/ui/src/components/ui/alert-dialog/` |
| alert | `reference/apps/ui/registry/default/ui/alert.tsx` | native; read Shards `field/**` and `form/**` for invalid-message semantics | `packages/ui/src/components/ui/alert/` |
| autocomplete | `reference/apps/ui/registry/default/ui/autocomplete.tsx` | `shardsui/packages/shardsui/src/lib/components/autocomplete/**`, `shardsui/docs/src/content/autocomplete.md` | `packages/ui/src/components/ui/autocomplete/` |
| avatar | `reference/apps/ui/registry/default/ui/avatar.tsx` | `shardsui/packages/shardsui/src/lib/components/avatar/**`, `shardsui/docs/src/content/avatar.md` | `packages/ui/src/components/ui/avatar/` |
| badge | `reference/apps/ui/registry/default/ui/badge.tsx` | native; read Shards `button/**` for polymorphic and attribute patterns | `packages/ui/src/components/ui/badge/` |
| breadcrumb | `reference/apps/ui/registry/default/ui/breadcrumb.tsx` | native; read Shards `menu/**` for overflow-menu composition | `packages/ui/src/components/ui/breadcrumb/` |
| button | `reference/apps/ui/registry/default/ui/button.tsx` | `shardsui/packages/shardsui/src/lib/components/button/**`, `shardsui/docs/src/content/button.md` | `packages/ui/src/components/ui/button/` |
| calendar | `reference/apps/ui/registry/default/ui/calendar.tsx` | no direct primitive; read Shards `field/**`, `input/**`, `popover/**`, then derive the Svelte-native composition from the complete COSS contract | `packages/ui/src/components/ui/calendar/` |
| card | `reference/apps/ui/registry/default/ui/card.tsx` | native; read Shards `field/**` for heading and description composition patterns | `packages/ui/src/components/ui/card/` |
| checkbox-group | `reference/apps/ui/registry/default/ui/checkbox-group.tsx` | `shardsui/packages/shardsui/src/lib/components/checkbox-group/**`, `shardsui/docs/src/content/checkbox-group.md` | `packages/ui/src/components/ui/checkbox-group/` |
| checkbox | `reference/apps/ui/registry/default/ui/checkbox.tsx` | `shardsui/packages/shardsui/src/lib/components/checkbox/**`, `shardsui/docs/src/content/checkbox.md` | `packages/ui/src/components/ui/checkbox/` |
| collapsible | `reference/apps/ui/registry/default/ui/collapsible.tsx` | `shardsui/packages/shardsui/src/lib/components/collapsible/**`, `shardsui/docs/src/content/collapsible.md` | `packages/ui/src/components/ui/collapsible/` |
| combobox | `reference/apps/ui/registry/default/ui/combobox.tsx` | `shardsui/packages/shardsui/src/lib/components/combobox/**`, `shardsui/docs/src/content/combobox.md` | `packages/ui/src/components/ui/combobox/` |
| command | `reference/apps/ui/registry/default/ui/command.tsx` | Shards `autocomplete/**` and `dialog/**` plus both docs pages | `packages/ui/src/components/ui/command/` |
| context-menu | `reference/apps/ui/registry/default/ui/context-menu.tsx` | `shardsui/packages/shardsui/src/lib/components/context-menu/**`, `shardsui/docs/src/content/context-menu.md` | `packages/ui/src/components/ui/context-menu/` |
| dialog | `reference/apps/ui/registry/default/ui/dialog.tsx` | `shardsui/packages/shardsui/src/lib/components/dialog/**`, `shardsui/docs/src/content/dialog.md` | `packages/ui/src/components/ui/dialog/` |
| drawer | `reference/apps/ui/registry/default/ui/drawer.tsx` | `shardsui/packages/shardsui/src/lib/components/drawer/**`, `shardsui/docs/src/content/drawer.md` | `packages/ui/src/components/ui/drawer/` |
| empty | `reference/apps/ui/registry/default/ui/empty.tsx` | native; read Shards `button/**` and `field/**` composition patterns | `packages/ui/src/components/ui/empty/` |
| field | `reference/apps/ui/registry/default/ui/field.tsx` | `shardsui/packages/shardsui/src/lib/components/field/**`, `shardsui/docs/src/content/field.md` | `packages/ui/src/components/ui/field/` |
| fieldset | `reference/apps/ui/registry/default/ui/fieldset.tsx` | `shardsui/packages/shardsui/src/lib/components/fieldset/**`, `shardsui/docs/src/content/fieldset.md` | `packages/ui/src/components/ui/fieldset/` |
| form | `reference/apps/ui/registry/default/ui/form.tsx` | `shardsui/packages/shardsui/src/lib/components/form/**`, `shardsui/docs/src/content/form.md` | `packages/ui/src/components/ui/form/` |
| frame | `reference/apps/ui/registry/default/ui/frame.tsx` | native; read Shards `field/**` and `separator/**` composition patterns | `packages/ui/src/components/ui/frame/` |
| group | `reference/apps/ui/registry/default/ui/group.tsx` | native; read Shards `button/**`, `field/**`, and `input/**` | `packages/ui/src/components/ui/group/` |
| input-group | `reference/apps/ui/registry/default/ui/input-group.tsx` | native composition; read Shards `input/**`, `button/**`, and `field/**` | `packages/ui/src/components/ui/input-group/` |
| input | `reference/apps/ui/registry/default/ui/input.tsx` | `shardsui/packages/shardsui/src/lib/components/input/**`, `shardsui/docs/src/content/input.md` | `packages/ui/src/components/ui/input/` |
| kbd | `reference/apps/ui/registry/default/ui/kbd.tsx` | native; read Shards `button/**` attribute-forwarding pattern | `packages/ui/src/components/ui/kbd/` |
| label | `reference/apps/ui/registry/default/ui/label.tsx` | native; read Shards `field/**`, `fieldset/**`, and their docs | `packages/ui/src/components/ui/label/` |
| menu | `reference/apps/ui/registry/default/ui/menu.tsx` | `shardsui/packages/shardsui/src/lib/components/menu/**`, `shardsui/docs/src/content/menu.md` | `packages/ui/src/components/ui/menu/` |
| meter | `reference/apps/ui/registry/default/ui/meter.tsx` | `shardsui/packages/shardsui/src/lib/components/meter/**`, `shardsui/docs/src/content/meter.md` | `packages/ui/src/components/ui/meter/` |
| number-field | `reference/apps/ui/registry/default/ui/number-field.tsx` | no direct primitive; read Shards `input/**`, `field/**`, `button/**`, and their docs | `packages/ui/src/components/ui/number-field/` |
| otp-field | `reference/apps/ui/registry/default/ui/otp-field.tsx` | no direct primitive; read Shards `input/**`, `field/**`, and their docs | `packages/ui/src/components/ui/otp-field/` |
| pagination | `reference/apps/ui/registry/default/ui/pagination.tsx` | native composition; read Shards `button/**` and `menu/**` | `packages/ui/src/components/ui/pagination/` |
| popover | `reference/apps/ui/registry/default/ui/popover.tsx` | `shardsui/packages/shardsui/src/lib/components/popover/**`, `shardsui/docs/src/content/popover.md` | `packages/ui/src/components/ui/popover/` |
| preview-card | `reference/apps/ui/registry/default/ui/preview-card.tsx` | `shardsui/packages/shardsui/src/lib/components/preview-card/**`, `shardsui/docs/src/content/preview-card.md` | `packages/ui/src/components/ui/preview-card/` |
| progress | `reference/apps/ui/registry/default/ui/progress.tsx` | `shardsui/packages/shardsui/src/lib/components/progress/**`, `shardsui/docs/src/content/progress.md` | `packages/ui/src/components/ui/progress/` |
| radio-group | `reference/apps/ui/registry/default/ui/radio-group.tsx` | Shards `radio/**`, `radio-group/**`, and `shardsui/docs/src/content/radio.md` | `packages/ui/src/components/ui/radio-group/` |
| scroll-area | `reference/apps/ui/registry/default/ui/scroll-area.tsx` | `shardsui/packages/shardsui/src/lib/components/scroll-area/**`, `shardsui/docs/src/content/scroll-area.md` | `packages/ui/src/components/ui/scroll-area/` |
| select | `reference/apps/ui/registry/default/ui/select.tsx` | `shardsui/packages/shardsui/src/lib/components/select/**`, `shardsui/docs/src/content/select.md` | `packages/ui/src/components/ui/select/` |
| separator | `reference/apps/ui/registry/default/ui/separator.tsx` | `shardsui/packages/shardsui/src/lib/components/separator/**`, `shardsui/docs/src/content/separator.md` | `packages/ui/src/components/ui/separator/` |
| sheet | `reference/apps/ui/registry/default/ui/sheet.tsx` | Shards `dialog/**` and `drawer/**` plus both docs pages | `packages/ui/src/components/ui/sheet/` |
| sidebar | `reference/apps/ui/registry/default/ui/sidebar.tsx` | native composition; read Shards `drawer/**`, `menu/**`, `tooltip/**`, and all three docs pages | `packages/ui/src/components/ui/sidebar/` |
| skeleton | `reference/apps/ui/registry/default/ui/skeleton.tsx` | native; read Shards `progress/**` for state and accessibility patterns | `packages/ui/src/components/ui/skeleton/` |
| slider | `reference/apps/ui/registry/default/ui/slider.tsx` | `shardsui/packages/shardsui/src/lib/components/slider/**`, `shardsui/docs/src/content/slider.md` | `packages/ui/src/components/ui/slider/` |
| spinner | `reference/apps/ui/registry/default/ui/spinner.tsx` | native; read Shards `progress/**` and its docs | `packages/ui/src/components/ui/spinner/` |
| switch | `reference/apps/ui/registry/default/ui/switch.tsx` | `shardsui/packages/shardsui/src/lib/components/switch/**`, `shardsui/docs/src/content/switch.md` | `packages/ui/src/components/ui/switch/` |
| table | `reference/apps/ui/registry/default/ui/table.tsx` | native; read Shards `scroll-area/**` for overflow composition | `packages/ui/src/components/ui/table/` |
| tabs | `reference/apps/ui/registry/default/ui/tabs.tsx` | `shardsui/packages/shardsui/src/lib/components/tabs/**`, `shardsui/docs/src/content/tabs.md` | `packages/ui/src/components/ui/tabs/` |
| textarea | `reference/apps/ui/registry/default/ui/textarea.tsx` | native; read Shards `input/**`, `field/**`, and their docs | `packages/ui/src/components/ui/textarea/` |
| toast | `reference/apps/ui/registry/default/ui/toast.tsx` | `shardsui/packages/shardsui/src/lib/components/toast/**`, `shardsui/docs/src/content/toast.md` | `packages/ui/src/components/ui/toast/` |
| toggle-group | `reference/apps/ui/registry/default/ui/toggle-group.tsx` | `shardsui/packages/shardsui/src/lib/components/toggle-group/**`, `shardsui/docs/src/content/toggle-group.md` | `packages/ui/src/components/ui/toggle-group/` |
| toggle | `reference/apps/ui/registry/default/ui/toggle.tsx` | `shardsui/packages/shardsui/src/lib/components/toggle/**`, `shardsui/docs/src/content/toggle.md` | `packages/ui/src/components/ui/toggle/` |
| toolbar | `reference/apps/ui/registry/default/ui/toolbar.tsx` | `shardsui/packages/shardsui/src/lib/components/toolbar/**`, `shardsui/docs/src/content/toolbar.md` | `packages/ui/src/components/ui/toolbar/` |
| tooltip | `reference/apps/ui/registry/default/ui/tooltip.tsx` | `shardsui/packages/shardsui/src/lib/components/tooltip/**`, `shardsui/docs/src/content/tooltip.md` | `packages/ui/src/components/ui/tooltip/` |

## Task C0: Establish component conventions and contract tests

**Owner:** coordinator with two reviewers
**Files:** shared test helpers, parity loader, package export policy, component template documentation
**Prerequisite:** foundation complete

### Step 1: Choose one representative vertical slice

Use `separator` only as the convention slice. The agent must follow the full component contract and source row. Do not use a fabricated component.

Write failing tests for:

- native attribute and callback forwarding;
- class merge order;
- element ref binding;
- snippet rendering;
- Shards state/data attribute preservation;
- SSR rendering and hydration;
- local barrel exports;
- no legacy Svelte syntax.

### Step 2: Establish file conventions

The preferred layout is:

```text
packages/ui/src/components/ui/separator/
├── index.ts
├── separator.svelte
├── separator.test.ts
└── separator.types.test.ts
```

Part names use kebab-case filenames and PascalCase exports. Compound barrels export `Root`, `Trigger`, `Panel`, and other Shards-aligned part names. Types are exported when consumers need them.

The browser parity loader uses `import.meta.glob` so future component fixtures do not require concurrent edits to an aggregate map.

### Step 3: Review and integrate separator

Run both required reviewers. After approval, integrate and update coordinator-owned package and registry exports.

Commit:

```text
feat(packages/ui): add separator
```

## Wave 1: Static, native, and low-coupling components

Queue C1 through C5 together after C0 and launch the first three in parallel. Start the remaining lanes as worker slots become free. Each task follows the full contract separately for every component in the task.

### Task C1: Port alert, badge, card, and empty

**Components:** `alert`, `badge`, `card`, `empty`
**Dependency:** button may be represented through a test double in the empty fixture until C5 integrates; production imports are coordinator-fixed after C5.
**Commit:** `feat(packages/ui): add alert badge card and empty`

Required tests cover every part export, semantic heading/description relationships, variants, polymorphic rendering where upstream supports it, destructive alert styling, and snippet/attribute forwarding.

### Task C2: Port breadcrumb, frame, kbd, and skeleton

**Components:** `breadcrumb`, `frame`, `kbd`, `skeleton`
**Commit:** `feat(packages/ui): add breadcrumb frame kbd and skeleton`

Required tests cover landmark/list semantics, collapsed breadcrumb behavior, frame slots translated to snippets, keyboard-key markup, animation classes, and reduced-motion behavior.

### Task C3: Port input, label, and textarea

**Components:** `input`, `label`, `textarea`
**Commit:** `feat(packages/ui): add input label and textarea`

Required tests cover all native attributes and events, value and ref binding, file inputs, invalid/disabled/read-only states, form association, label activation, field context integration, autoresize only if present upstream, and SSR hydration.

### Task C4: Port avatar, meter, progress, and spinner

**Components:** `avatar`, `meter`, `progress`, `spinner`
**Commit:** `feat(packages/ui): add avatar meter progress and spinner`

Required tests cover image success/error/fallback timing, value bounds, indeterminate states, label relationships, CSS progress variables, status announcements where upstream supplies them, animation, and reduced motion.

### Task C5: Port button, toggle, toggle-group, checkbox, and switch

**Components:** `button`, `toggle`, `toggle-group`, `checkbox`, `switch`
**Commit:** `feat(packages/ui): add button toggle checkbox and switch controls`

Required tests cover variants and sizes, link/polymorphic behavior, pressed state, single/multiple toggle selection, orientation, keyboard navigation, checked/indeterminate state, form values, disabled behavior, focus-visible rings, and controlled/bindable contracts.

### Wave 1 integration gate

The coordinator integrates independently approved commits as they arrive, then updates shared exports and registry metadata in one commit:

```text
chore(packages/ui): export wave one components
```

Run package check, unit tests, SSR tests, registry schema, and affected browser parity routes. Wave 2 tasks may start as soon as their named dependencies are integrated.

## Wave 2: Disclosure, form, collection, and layout primitives

### Task C6: Port accordion, collapsible, and tabs

**Components:** `accordion`, `collapsible`, `tabs`
**Dependencies:** button
**Commit:** `feat(packages/ui): add disclosure and tabs components`

Required tests cover `.Root` namespace APIs, single/multiple modes, orientation, disabled parts, controlled/bindable values, header structure, keyboard traversal, mount/unmount or hidden behavior, starting/ending style attributes, height variables, and reduced motion.

### Task C7: Port field, fieldset, form, group, and input-group

**Components:** `field`, `fieldset`, `form`, `group`, `input-group`
**Dependencies:** button, input, label, separator, textarea
**Commit:** `feat(packages/ui): add field form and input groups`

Required tests cover generated and explicit IDs, label/control/description/error relationships, invalid propagation, fieldset legend and disabled semantics, server actions and native submit behavior, horizontal/vertical layout, addons, buttons, text, textarea composition, and nested contexts.

### Task C8: Port checkbox-group, radio-group, and slider

**Components:** `checkbox-group`, `radio-group`, `slider`
**Dependencies:** checkbox, field, label
**Commit:** `feat(packages/ui): add selection group and slider components`

Required tests cover form values, roving focus, keyboard direction, orientation, disabled items, multiple values, range thumbs, min/max/step, pointer dragging, hidden inputs, label relationships, and bindable state.

### Task C9: Port scroll-area, pagination, and table

**Components:** `scroll-area`, `pagination`, `table`
**Dependencies:** button, separator
**Commit:** `feat(packages/ui): add scroll pagination and table components`

Required tests cover scrollbar orientation and visibility, corner behavior, overflow keyboard access, pagination landmark/current-page semantics, ellipsis, link attributes, table captions/headers/rows, responsive overflow, and forwarded native attributes.

### Wave 2 integration gate

Integrate approved lanes immediately when their dependencies and both reviews are satisfied. Then commit coordinator-owned exports:

```text
chore(packages/ui): export wave two components
```

Run all package tests plus keyboard browser tests for disclosure, grouped selection, form association, slider, and scroll behavior.

## Wave 3: Overlays, menus, and selection surfaces

### Task C10: Port dialog, alert-dialog, sheet, and drawer

**Components:** `dialog`, `alert-dialog`, `sheet`, `drawer`
**Dependencies:** button
**Commit:** `feat(packages/ui): add dialog sheet and drawer components`

Required tests cover portals, modal and non-modal behavior, accessible titles/descriptions, initial focus, focus trap, escape and outside dismissal, focus restoration, nested overlays, alert-dialog cancellation, sheet sides, drawer direction and dragging, overlay/content motion, scroll locking, and reduced motion.

### Task C11: Port popover, preview-card, and tooltip

**Components:** `popover`, `preview-card`, `tooltip`
**Dependencies:** button
**Commit:** `feat(packages/ui): add popover preview card and tooltip`

Required tests cover trigger composition, anchors, collision and placement CSS variables, delay groups, hover/focus/touch behavior, interactive-content boundaries, dismissal, portal targets, accessible descriptions, and reduced motion.

### Task C12: Port menu, context-menu, and toolbar

**Components:** `menu`, `context-menu`, `toolbar`
**Dependencies:** button, checkbox, radio-group, separator
**Commit:** `feat(packages/ui): add menu context menu and toolbar`

Required tests cover namespace parts, nested submenus, checkbox/radio items, shortcut and inset parts, context-point placement, typeahead, roving focus, arrow keys by orientation and direction, escape behavior, disabled items, portal behavior, and focus restoration.

### Task C13: Port autocomplete, combobox, select, and command

**Components:** `autocomplete`, `combobox`, `select`, `command`
**Dependencies:** button, dialog, input, scroll-area, separator
**Commit:** `feat(packages/ui): add autocomplete combobox select and command`

Required tests cover filtering, empty/loading states, typed input, exact item identity, single/multiple selection where supported, input-value synchronization, typeahead, keyboard navigation, virtual focus or active descendant behavior, hidden form values, portal placement, grouped items, command dialog composition, and async updates present in upstream examples.

### Wave 3 integration gate

Integrate approved lanes as soon as dependencies permit. Commit shared exports:

```text
chore(packages/ui): export wave three components
```

Run all overlay tests serially once to detect leaked portals, focus locks, body styles, and timers. Run the in-app browser across nested overlay combinations and both themes.

## Wave 4: Specialized behavior and application-scale composition

### Task C14: Port calendar

**Component:** `calendar`
**Dependencies:** button, field, popover, select
**Commit:** `feat(packages/ui): add calendar`

Before writing tests, read the complete COSS calendar file, calendar docs, date-picker docs, and every calendar/date-picker particle. Read the nearest local Shards primitives completely. Derive the public API, behavior, and styling from COSS; shadcn-svelte source and dependency choices are not implementation authority. If COSS-specific requirements justify another calendar primitive, use Context7 for that candidate and request coordinator approval with its source, license, accessibility contract, and a behavior comparison before adding it.

Required tests cover single, multiple, range, month/year selection, outside days, fixed weeks, disabled and unavailable dates, min/max rules, keyboard grid navigation, locale, week start, captions, dropdowns, custom day content, focus restoration in date-picker composition, and all COSS DayPicker class/formatter mappings.

If the selected composition cannot meet a behavior, implement a documented wrapper. Do not silently drop a prop. Add any approved dependency notice to `THIRD_PARTY_NOTICES.md` through a coordinator request. Render every UI icon with `@hugeicons/svelte` and `@hugeicons/core-free-icons`; reject Lucide packages, Lucide class names or path copies, and substitute hand-drawn icon SVGs.

### Task C15: Port number-field and otp-field

**Components:** `number-field`, `otp-field`
**Dependencies:** button, field, input, separator
**Commit:** `feat(packages/ui): add number and otp fields`

`number-field` tests cover locale-aware parse/format, decimal and negative input, min/max/step, clamping timing, increment/decrement buttons, wheel policy, Arrow/Page/Home/End keys where upstream supports them, controlled/bindable state, invalid text, and form submission.

`otp-field` tests cover digit and alphanumeric patterns, paste, partial paste, selection replacement, forward/backward focus movement, Backspace/Delete, disabled/read-only, mobile input mode, password-manager layout behavior where present, completion callback, controlled/bindable value, and multi-slot styling.

Use native inputs plus Shards field/input parts. Adding an external OTP or number library requires a decision record, dependency review, and coordinator approval.

### Task C16: Port toast

**Component:** `toast`
**Dependencies:** button
**Commit:** `feat(packages/ui): add toast`

Required tests cover provider/portal lifecycle, promise/loading/success/error flows present upstream, action and cancel callbacks, timeout pause/resume, swipe or drag behavior, stacking, dismiss-all, regions and announcements, focus/keyboard access, theme, viewport placement, SSR safety, and cleanup between tests.

### Task C17: Port sidebar

**Component:** `sidebar`
**Dependencies:** button, collapsible, drawer, input, menu, separator, skeleton, tooltip
**Commit:** `feat(packages/ui): add sidebar`

Freshly inspect the entire large COSS source, its hook usage, every sidebar particle, and the responsive reference at multiple widths. Required tests cover provider context, controlled/bindable open state, desktop collapse modes, mobile drawer behavior, keyboard shortcut, cookie or persistence behavior only if present upstream, menu subparts, action buttons, badges, skeleton states, rail interaction, tooltip behavior, nested groups, focus order, and SSR/hydration.

### Wave 4 integration gate

Integrate approved lanes in dependency order and commit shared exports plus registry items:

```text
chore(packages/ui): export specialized components
```

Run the full package, SSR, registry, and component parity suite. Perform a dependency audit to ensure React, React DOM, Base UI React, and React DayPicker are absent.

## Task C18: Complete package-level API and registry integration

**Owner:** coordinator
**Prerequisite:** all 54 component lanes approved
**Files:** shared package barrel, package manifest, registry UI manifest, generated registry artifacts, parity status

### Step 1: Export the final API

Update `packages/ui/src/index.ts` and explicit `package.json` exports so consumers can use:

```ts
import * as Accordion from "@coss-sv/ui/components/ui/accordion";
import { Button } from "@coss-sv/ui/components/ui/button";
```

Every directory is also installable through the registry without depending on the monorepo package name.

Write an export test that imports every public symbol from built package output. Reject accidental exports of tests, fixtures, evidence files, or internal Shards helpers.

### Step 2: Populate registry metadata

Add all 54 items to `apps/ui/registry/registry-ui.ts` with exact:

- file lists and destinations;
- npm dependencies;
- registry dependencies;
- CSS variables and keyframes;
- category and description;
- composed-component relationships.

Add aggregate item `ui` containing all components. Run the shadcn-svelte registry builder and freshness tests.

### Step 3: Smoke-install representative classes

Install at least:

- `button` as a leaf;
- `accordion` as a compound primitive;
- `dialog` as a portal overlay;
- `command` as a composition;
- `calendar` as a special dependency;
- `sidebar` as the largest multi-file composition;
- `ui` as the complete bundle.

Each fresh fixture must pass `svelte-check`, unit smoke rendering, and production build.

### Step 4: Commit

```text
feat(apps/ui): publish component registry
```

## Task C19: Final component audit

Run three integration reviews concurrently against the same HEAD:

1. package API and Svelte 5 architecture;
2. full visual, interaction, keyboard, and accessibility parity by component family;
3. provenance, license boundary, registry installation, and published package contents.

The parity reviewer must freshly inspect the source matrix and may not approve solely from earlier lane reviews. It samples every component and fully replays high-risk overlays, selection surfaces, calendar, number field, OTP field, toast, and sidebar.

Run from a clean worktree:

```bash
pnpm install --frozen-lockfile
pnpm --filter @coss-sv/ui check
pnpm --filter @coss-sv/ui test
pnpm --filter @coss-sv/ui build
pnpm --filter @coss-sv/ui pack:check
pnpm --filter @coss-sv/docs registry:build
pnpm --filter @coss-sv/docs registry:check
pnpm --filter @coss-sv/docs registry:smoke
pnpm test:e2e --grep "component parity"
pnpm exec tsx scripts/parity/inventory.mts --check
git diff --exit-code
```

Expected parity status: 54 components implemented and reviewed, with 508 documentation particles still reserved for Plan 3.

Fixes use scoped lowercase subjects, for example:

```text
fix(packages/ui): align dialog focus restoration
fix(packages/ui): preserve select form value
refactor(packages/ui): strengthen compound part types
```

The plan is complete only when all three final reviewers approve the same commit and the component deviation ledger contains no unapproved entry.
