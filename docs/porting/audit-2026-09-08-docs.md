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
