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
- Tooltip triggers wrap the same toolbar controls with `display: contents`; their popups anchor to the registered control elements. The wrappers do not add a tab stop or alter toolbar geometry. Each control retains its upstream accessible name, description, and roving-focus position.

## Verification targets

- exact SSR role, slots, root/group/separator classes, and native prop forwarding
- horizontal, vertical, LTR, and RTL roving focus; loop and no-loop behavior; disabled items; input selection boundaries
- Toggle Group selection, tooltip focus behavior, Shards Select opening and selection, and the exact toolbar tab sequence
- group disabled propagation, separator orientation, ref bindings, and hydration without warnings
