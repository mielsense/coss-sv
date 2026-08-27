# Select port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/select.tsx`
- `reference/apps/ui/content/docs/components/select.mdx`
- `reference/apps/ui/registry/default/particles/p-select-1.tsx` through `p-select-23.tsx`

The complete registry wrapper, documentation page, and all twenty-three direct particles were read from the MIT-designated `reference/apps/ui/**` subtree. Every indirect importing particle was inventoried and inspected. No AGPL-default package source was used.

The particles cover trigger sizes, placeholder and controlled values, disabled and invalid states, groups and separators, item indicators, object values, multiple selection, typeahead, long scrolling lists, custom positioning, form values, and item-aligned placement.

## Shards files inspected

The complete implementation and exported types under `shardsui/packages/shardsui/src/lib/components/select/`, the Select documentation and demos, and every Select test and fixture were inspected. Shards owns collection state, item identity, typeahead, keyboard navigation, selection, hidden form values, focus management, scroll arrows, portals, and collision handling.

Context7 returned `Monthly quota reached`; the port uses the pinned local Svelte Edge references and complete local Shards implementation. Chrome was not used.

## Translation decisions

- `Select.Root` exposes typed single and multiple bindings while delegating collection identity, typeahead, and form serialization to Shards.
- A root `aria-label` is forwarded to the trigger when no visible `Select.Label` names it. A visible label still wins through Shards' `aria-labelledby` relationship.
- `Select.Trigger`, `Value`, `Label`, `Group`, `GroupLabel`, `Separator`, and `Item` preserve the exact COSS slots, classes, check icon, disabled behavior, and trigger sizes.
- The popup composes Shards Portal, Positioner, Popup, List, and scroll arrows. The COSS frame and gradients are retained exactly.
- COSS `alignItemWithTrigger` is translated to Shards' `side="none"` mode. A bounded measurement adjustment aligns the selected item with the trigger without replacing Shards' collision and scroll management.
- Function-valued Shards offsets remain functions. The wrapper adds its measured correction instead of prematurely resolving responsive offset callbacks.
- Custom portal targets and the non-item-aligned positioning path remain available.

## Verification targets

- single and multiple values, exact object identity, typeahead, Arrow/Home/End navigation, disabled items, Enter, Escape, and focus restoration
- placeholders, controlled and bindable state, repeated hidden form values, groups, labels, separators, and long-list scroll arrows
- item-aligned and anchored placement, offset callbacks, portals, collision behavior, RTL, and responsive geometry
- exact trigger sizes, slots, class strings, selected indicators, invalid and disabled styles, dark theme, and coarse-pointer targets

## Browser evidence

The Codex in-app Browser rendered all twenty-three particle sections. The default trigger measured `256×32` pixels, exposed `role="combobox"` and the root label `Select framework`, and displayed `Next.js`. Closed-trigger typeahead changed the value to Vite; opening the trigger produced four options. No external Chrome window was used.
