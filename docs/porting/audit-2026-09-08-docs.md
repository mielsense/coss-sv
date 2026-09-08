# Documentation audit, 2026-09-08

## Preview state retention

- id: docs-preview-state
- file: `apps/ui/src/lib/content/components/PreviewCard.svelte`
- category: bug
- severity: medium
- confidence: high
- evidence: the preview subtree was inside `{#if tab === "preview"}`. In the in-app browser at
  `/docs/components/checkbox`, the first checkbox changed from checked to unchecked after opening
  Code and returning to Preview. The permitted reference
  `reference/apps/ui/components/component-preview-tabs.tsx` keeps the component mounted and toggles
  visibility. Its checkbox stayed checked through the same tab sequence in the in-app browser.
- why_it_matters: inspecting an example's source erased entered values and other component state.
- recommended_change: retain the preview instance and hide it with `hidden` and `inert` while Code
  is selected. Continue mounting the highlighted source only when requested.
- version_or_flag_blocker: none, Svelte 5.56.10 and SvelteKit 2.70.3.
- patch_scope: preview presentation and its browser regression.
- canonical_owner: Svelte Edge `references/snippets.md`, `references/best-practices.md`, and
  `references/testing.md`.

The read set includes the complete upstream component-preview and component-preview-tabs files,
the target PreviewCard, CodeSource, CopyButton, Tabs root and panel wrappers, and the local Shards
Tabs panel implementation. The Shards panel also uses `hidden` and `inert` for retained content.

The focused regression failed before the change because the checkbox node no longer existed after
opening Code. It passes after the change and verifies retained state, exclusion from accessible role
queries, failed programmatic focus on the hidden control, and interaction after returning to Preview.
The same assertions are part of the existing production preview-card browser suite.

## Manual installation instructions

- id: docs-manual-install
- file: `apps/ui/content/docs/get-started.svx`
- category: documentation-gap
- severity: medium
- confidence: high
- evidence: the guide directed readers to the preview Code tab to install a component. That tab
  contains the particle, which imports component modules rather than defining them. The
  `InstallCommand` Manual tab renders the complete source bundle from
  `loadRegistryComponentSource`, including local component dependencies.
- why_it_matters: following the guide left copied examples with unresolved component imports.
- recommended_change: direct component installation to Installation > Manual, and explain the
  separate example-copy flow.
- version_or_flag_blocker: none.
- patch_scope: the manual installation section only.
- canonical_owner: Svelte Edge `references/best-practices.md` and the repository documentation plan.

The complete permitted upstream get-started page and current target get-started, InstallCommand,
particle-source, registry-component-source, and present-source-aliases files were read. The wording
was checked against Unslop.

## Validation

The Svelte review also found a duplicate-control example in Get Started. `Slider.Root` always
renders its styled control after any custom children. The guide now uses the self-closing styled
root with an accessible label and `defaultValue`. The complete wrapper and local Shards slider root
were read to verify this composition.

- `pnpm check`: passed, zero Svelte diagnostics.
- Focused `preview-state.browser.mjs`: failed before the fix, passed after it.
- In-app reference inspection: checkbox remained checked through Code and Preview.
- In-app fixed port inspection: checkbox remained checked, and the hidden preview had both `hidden`
  and `inert` set while Code was selected.
- Production build and `preview-card.browser.mjs`: passed, including the state regression.

The broad audit also observed that analytics is injected in the global root layout, including
preview routes. Its collector requests fail in the local browser while automated tests mock its
script. That coordinator-owned concern is separate from this patch.

## Per-component source and default-example review

Each row was checked individually against the permitted COSS registry file, every production Svelte
wrapper in the listed directory, its export module, and its current Svelte documentation page.
The in-app browser compared the default example at 1280 by 800 pixels on the reference and port.
Visible text, inspected slot tags and roles, font sizes, and rounded element heights matched in all
17 rows. This is default-state DOM and computed-style coverage, not approval of every example,
interaction, theme, or viewport. Hugeicons replacements are an approved port difference.

| Component | Permitted reference | Production directory and files read | Default example result |
| --- | --- | --- | --- |
| alert | `reference/apps/ui/registry/default/ui/alert.tsx` | `packages/ui/src/components/ui/alert/`: `alert-action.svelte`, `alert-description.svelte`, `alert-title.svelte`, `alert.svelte`, `index.ts` | matched |
| badge | `reference/apps/ui/registry/default/ui/badge.tsx` | `packages/ui/src/components/ui/badge/`: `badge.svelte`, `index.ts` | matched |
| breadcrumb | `reference/apps/ui/registry/default/ui/breadcrumb.tsx` | `packages/ui/src/components/ui/breadcrumb/`: `breadcrumb-ellipsis.svelte`, `breadcrumb-item.svelte`, `breadcrumb-link.svelte`, `breadcrumb-list.svelte`, `breadcrumb-page.svelte`, `breadcrumb-separator.svelte`, `breadcrumb.svelte`, `index.ts` | matched |
| card | `reference/apps/ui/registry/default/ui/card.tsx` | `packages/ui/src/components/ui/card/`: `card-action.svelte`, `card-description.svelte`, `card-footer.svelte`, `card-frame-action.svelte`, `card-frame-description.svelte`, `card-frame-footer.svelte`, `card-frame-header.svelte`, `card-frame-title.svelte`, `card-frame.svelte`, `card-header.svelte`, `card-panel.svelte`, `card-part.svelte`, `card-title.svelte`, `card.svelte`, `index.ts` | matched |
| empty | `reference/apps/ui/registry/default/ui/empty.tsx` | `packages/ui/src/components/ui/empty/`: `empty-content.svelte`, `empty-description.svelte`, `empty-header.svelte`, `empty-media.svelte`, `empty-part.svelte`, `empty-title.svelte`, `empty.svelte`, `index.ts` | matched |
| frame | `reference/apps/ui/registry/default/ui/frame.tsx` | `packages/ui/src/components/ui/frame/`: `frame-description.svelte`, `frame-footer.svelte`, `frame-header.svelte`, `frame-panel.svelte`, `frame-title.svelte`, `frame.svelte`, `index.ts` | matched |
| group | `reference/apps/ui/registry/default/ui/group.tsx` | `packages/ui/src/components/ui/group/`: `group-root.svelte`, `group-separator.svelte`, `group-styles.ts`, `group-text.svelte`, `index.ts` | matched |
| input-group | `reference/apps/ui/registry/default/ui/input-group.tsx` | `packages/ui/src/components/ui/input-group/`: `index.ts`, `input-group-addon.svelte`, `input-group-input.svelte`, `input-group-root.svelte`, `input-group-styles.ts`, `input-group-text.svelte`, `input-group-textarea.svelte` | matched |
| kbd | `reference/apps/ui/registry/default/ui/kbd.tsx` | `packages/ui/src/components/ui/kbd/`: `index.ts`, `kbd-group.svelte`, `kbd.svelte` | matched |
| label | `reference/apps/ui/registry/default/ui/label.tsx` | `packages/ui/src/components/ui/label/`: `index.ts`, `label.svelte` | matched |
| meter | `reference/apps/ui/registry/default/ui/meter.tsx` | `packages/ui/src/components/ui/meter/`: `index.ts`, `meter-indicator.svelte`, `meter-label.svelte`, `meter-root.svelte`, `meter-track.svelte`, `meter-value.svelte` | matched |
| pagination | `reference/apps/ui/registry/default/ui/pagination.tsx` | `packages/ui/src/components/ui/pagination/`: `index.ts`, `pagination-content.svelte`, `pagination-ellipsis.svelte`, `pagination-item.svelte`, `pagination-link.svelte`, `pagination-next.svelte`, `pagination-previous.svelte`, `pagination.svelte` | matched |
| progress | `reference/apps/ui/registry/default/ui/progress.tsx` | `packages/ui/src/components/ui/progress/`: `index.ts`, `progress-indicator.svelte`, `progress-label.svelte`, `progress-root.svelte`, `progress-track.svelte`, `progress-value.svelte` | matched |
| skeleton | `reference/apps/ui/registry/default/ui/skeleton.tsx` | `packages/ui/src/components/ui/skeleton/`: `index.ts`, `skeleton.svelte` | matched |
| spinner | `reference/apps/ui/registry/default/ui/spinner.tsx` | `packages/ui/src/components/ui/spinner/`: `index.ts`, `spinner.svelte` | matched |
| table | `reference/apps/ui/registry/default/ui/table.tsx` | `packages/ui/src/components/ui/table/`: `index.ts`, `table-body.svelte`, `table-caption.svelte`, `table-cell.svelte`, `table-footer.svelte`, `table-head.svelte`, `table-header.svelte`, `table-row.svelte`, `table.svelte` | matched |
| textarea | `reference/apps/ui/registry/default/ui/textarea.tsx` | `packages/ui/src/components/ui/textarea/`: `index.ts`, `textarea.svelte` | matched |

The meter and progress root contracts and textarea Field.Control integration were cross-checked
against the local Shards implementations. No runtime parity defect was established in these
17 component families during this pass.

### Corrected API descriptions

All three findings are documentation gaps with high confidence, low severity, no version or flag
blocker, and a documentation-only patch scope. The canonical owner is Svelte Edge
`references/best-practices.md`, which requires typed native wrappers and accurate API guidance.

- `docs-textarea-size`, `apps/ui/content/docs/components/textarea.svx`: the page said numeric `size`
  becomes `rows`. The wrapper consumes `size` for data and padding decisions and forwards the
  separate native `rows` prop. The page now states that behavior. It also clarifies that `unstyled`
  removes outer control styles while preserving the inner textarea styles.
- `docs-group-text-tag`, `apps/ui/content/docs/components/group.svx`: the documented default tag
  was `span`; both the port and reference use `div`. The table now says `div`.
- `docs-card-tags`, `apps/ui/content/docs/components/card.svx`: the page allowed every HTML tag,
  but the exported `CardTag` type permits a defined set of container elements. The table now names
  the actual public type and explains the exclusion of void elements.

### Particle search browser readiness

The broad E2E run caught an immediate assertion observing `aria-expanded=false` before hydration
opened the empty particle chooser. `ParticleSearchField` initializes `open=false` and its effect
opens the chooser when no tags are selected. The unchanged suite passed on a subsequent run.
The test now waits for the expected expanded combobox before asserting or typing; it still fails
if the chooser never opens. The revised full particles browser script passed on the production site.


## Form and control documentation follow-up

The September 8 follow-up corrects four public documentation pages after reading their current
exports and wrappers, the matching local Shards Field.Control, and the permitted upstream docs.

| ID | File | Category | Severity | Confidence | Evidence and correction | Version or flag blocker | Canonical owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOC-05 | `apps/ui/content/docs/components/checkbox-group.svx` | API documentation | medium | high | The documented `CheckboxGroup.Checkbox` alias is absent from `packages/ui/src/components/ui/checkbox-group/index.ts`. Document `Item` and the actual `Parent` alias; both require `parent` for parent behavior, as shown in `checkbox-group-item.svelte`. | None | Public package exports |
| DOC-06 | `apps/ui/content/docs/components/field.svx` | API documentation | medium | high | `field-control.svelte` wraps Shards Control and registers its ID. Shards `field/field-control.svelte` renders only native input or textarea; it does not wrap an arbitrary third-party control. Describe the supported native control contract. | None | Shards Field.Control |
| DOC-07 | `apps/ui/content/docs/components/slider.svx` and `switch.svx` | Documentation | low | high | Both Examples introductions inherited “wrap checkboxes” from upstream. Name sliders and switches respectively. Switch also incorrectly described `checked` as an initial value; `switch.svelte` exposes `defaultChecked` for that contract. | None | Public wrapper props |

Validation: the documentation compiler accepts all 64 pages. Prettier checks the four changed SVX
pages; `git diff --check` passes. These are prose corrections; no production Svelte source changed.

### Default form/control comparison coverage

The Codex in-app browser compared the first documentation preview at 1280×800 for each family below,
using reference `http://localhost:4000/ui/docs/components/<family>` and the stable production port
`http://localhost:5104/docs/components/<family>`. Text, native control attributes, and up to 16
component-slot elements were inspected per preview. Visible element tags, roles, rounded heights,
and font sizes matched, as did visible text. This is a default-state comparison, not an approval of
all variants, keyboard paths, themes, or responsive sizes. Number Field is covered by its separate
review lane.

| Families | Result |
| --- | --- |
| button, checkbox, checkbox-group, combobox, field, fieldset | Default visible content and geometry match |
| form, input, otp-field, radio-group, select, separator | Default visible content and geometry match |
| slider, switch, tabs, toggle, toggle-group, toolbar | Default visible content and geometry match |

Observed implementation differences do not change these visible defaults: the Svelte checkbox and
radio wrappers retain hidden zero-height indicators, unchecked checkbox-group inputs retain their
item values, Combobox relies on the native text-input default, Select adds an accessible label, and
Toolbar preserves concrete control slot names where the reference uses `tooltip-trigger`. These
observations do not substitute for the form/submission and interaction tests owned by the component
lane. No additional visible default defect was established by this comparison.
