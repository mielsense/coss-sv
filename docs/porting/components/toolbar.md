# Toolbar port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/toolbar.tsx`
- `reference/apps/ui/content/docs/components/toolbar.mdx`
- `reference/apps/ui/registry/default/particles/p-toolbar-1.tsx`

The wrapper, documentation page, and only importing particle were read in full from `reference/apps/ui/**`. The particle combines Toolbar with Toggle Group, Button, Tooltip, and Select.

## Shards files inspected

The inspection covered every Toolbar implementation and type file under `shardsui/packages/shardsui/src/lib/components/toolbar/`, the complete Toolbar documentation and demo, all Toolbar tests, and all 21 Toolbar fixtures under `shardsui/packages/shardsui/tests/toolbar/fixtures/`.

Shards owns the toolbar role, orientation, direction-aware roving focus, loop behavior, disabled propagation, group registration, editable-input arrow handling, and separator orientation. The COSS layer supplies the exact card styling, gaps, group layout, separator styling, slots, and aliases.

Context7 returned `Monthly quota reached`, so the port uses the pinned local Svelte Edge references and complete local Shards materials. Selecting the Codex in-app Browser backend returned `Browser is not available`; its prescribed troubleshooting check exposed only a Chrome extension backend. Chrome was not used.

## Translation decisions

- The Svelte namespace is `Toolbar.Root`, `Toolbar.Button`, `Toolbar.Link`, `Toolbar.Input`, `Toolbar.Group`, and `Toolbar.Separator`. Long COSS aliases remain available.
- Root, Group, and Separator preserve the complete COSS class strings. Button, Link, and Input add only their exact `data-slot` attributes and otherwise forward Shards and native props.
- Shards keeps disabled toolbar items in its roving-focus model where appropriate, handles horizontal and vertical orientations, mirrors horizontal arrow keys in RTL, and yields arrow keys to text selection inside inputs until an edge is reached.
- The separator's default orientation remains perpendicular to the toolbar orientation through Shards; COSS classes style both orientation states.
- `p-toolbar-1` depends on Select and Tooltip, which are outside this lane. The deterministic fixture preserves the same toolbar sections, labels, icons, initial alignment, font choice, currency/percent actions, and Save action without expanding this lane's component ownership. The full docs example can switch to the component dependencies when their lanes land.

## Verification targets

- exact SSR role, slots, root/group/separator classes, and native prop forwarding
- horizontal, vertical, LTR, and RTL roving focus; Home/End; loop and no-loop behavior; disabled items; input selection boundaries
- group disabled propagation, separator orientation, ref bindings, and hydration without warnings
