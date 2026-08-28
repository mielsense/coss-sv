# Toolbar port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/toolbar.tsx`
- `reference/apps/ui/content/docs/components/toolbar.mdx`
- `reference/apps/ui/registry/default/particles/p-toolbar-1.tsx`

The wrapper, documentation page, and only importing particle were read in full from `reference/apps/ui/**`. The particle combines Toolbar with Toggle Group, Button, Tooltip, and Select.

## Shards files inspected

The inspection covered every Toolbar implementation and type file under `shardsui/packages/shardsui/src/lib/components/toolbar/`, the complete Toolbar documentation and demo, all Toolbar tests, and all 21 Toolbar fixtures under `shardsui/packages/shardsui/tests/toolbar/fixtures/`.

Shards owns the toolbar role, orientation, direction-aware roving focus, loop behavior, disabled propagation, group registration, editable-input arrow handling, and separator orientation. The COSS layer supplies the exact card styling, gaps, group layout, separator styling, slots, and aliases.

Context7 returned `Monthly quota reached`, so the port uses the pinned local Svelte Edge references and complete local Shards materials. Headless Chromium covers automated interaction checks; the coordinator performs the final comparison in the Codex in-app browser. Chrome was not used.

## Translation decisions

- The Svelte namespace is `Toolbar.Root`, `Toolbar.Button`, `Toolbar.Link`, `Toolbar.Input`, `Toolbar.Group`, and `Toolbar.Separator`. Long COSS aliases remain available.
- Root, Group, and Separator preserve the complete COSS class strings. Button, Link, and Input add only their exact `data-slot` attributes and otherwise forward Shards and native props.
- Shards keeps disabled toolbar items in its roving-focus model where appropriate, handles horizontal and vertical orientations, mirrors horizontal arrow keys in RTL, and yields arrow keys to text selection inside inputs until an edge is reached.
- The separator's default orientation remains perpendicular to the toolbar orientation through Shards; COSS classes style both orientation states.
- `p-toolbar-1` uses the integrated COSS Tooltip namespace and the real Shards Select namespace. The Select stays private to the parity fixture: its trigger, value, popup, list, items, indicators, scrolling arrows, classes, and initial Helvetica value reproduce the upstream composition without creating a partial public Select API.
- COSS's Select defaults `alignItemWithTrigger` to true. The pinned Shards Positioner has no equivalent prop, so the private fixture measures the selected option after Shards positions the popup and adjusts its side offset until the option and trigger share a center. At the published desktop reference size, the 32-pixel trigger spans `y=549..581` and the 28-pixel selected Helvetica option spans `y=551..579`; the browser assertion preserves that two-pixel inset on both edges.
- Every private Select item carries the upstream `data-slot="select-item"` attribute.
- Tooltip triggers wrap the same toolbar controls with `display: contents`; their popups anchor to the registered control elements. The wrappers do not add a tab stop or alter toolbar geometry. Each control retains its upstream accessible name, description, and roving-focus position.

## Verification targets

- exact SSR role, slots, root/group/separator classes, and native prop forwarding
- horizontal, vertical, LTR, and RTL roving focus; loop and no-loop behavior; disabled items; input selection boundaries
- Toggle Group selection, tooltip focus behavior, Shards Select opening and selection, and the exact toolbar tab sequence
- group disabled propagation, separator orientation, ref bindings, and hydration without warnings

## D8 documentation and particle port

The documentation lane freshly reread the complete permitted COSS Toolbar MDX page and particle, its Toggle Group, Tooltip, Select, and Button consumers, and the complete local Shards Toolbar source, documentation, demo, tests, 21 fixtures, and exported types. The page preserves the source's single preview, installation flow, usage, API text, and visible copy. The production particle uses the public namespaces and Hugeicons, preserves the intrinsic toolbar geometry, initial alignment and font, tooltips, separators, and Save action.

The composed Tooltip and toggle controls handle Arrow, Home, and End locally because the same DOM controls cannot also register as Shards Toolbar buttons through Svelte component delegation. The handler stops propagation after moving focus so the outer Toolbar composite cannot process the same key a second time. Browser coverage verifies that Align left advances to Align center and End reaches Save in normal and reduced-motion modes. The Codex in-app Browser measured the COSS toolbar at `428.86×42` pixels; the production particle now uses an intrinsic `w-fit` root to preserve that width in the standalone preview. Chrome was not used. The coordinator-owned documentation manifest still needs to enroll `components/toolbar`.
