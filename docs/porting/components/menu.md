# Menu port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/menu.tsx`
- `reference/apps/ui/content/docs/components/menu.mdx`
- `reference/apps/ui/registry/default/particles/p-menu-1.tsx` through `p-menu-9.tsx`
- Every particle under `reference/apps/ui/registry/default/particles/` that imports the Menu wrapper: `p-breadcrumb-1`, `p-breadcrumb-4`, `p-dialog-2`, `p-drawer-13`, `p-group-1`, `p-group-3`, `p-group-4`, `p-group-5`, `p-group-6`, `p-group-13`, `p-input-group-17`, and `p-input-group-18`

The registry wrapper, documentation page, and each importer were read in full from the MIT-designated `reference/apps/ui/**` subtree. No source under `reference/packages/ui/**` was used.

The nine direct particles cover the complete visible Menu surface: icons and shortcuts, disabled and destructive items, open-on-hover, checkbox and switch items, radio items, links, groups and labels, nested submenus, separators, and close-on-click behavior.

## Shards files inspected

The inspection covered every Menu implementation and type file under `shardsui/packages/shardsui/src/lib/components/menu/`, the complete Menu documentation, every Menu demo, all Menu tests, and all 92 Menu fixtures under `shardsui/packages/shardsui/tests/menu/fixtures/`.

Shards supplies the menu state machine, trigger semantics, portals, floating positioner, typeahead, roving focus, disabled-state handling, checkbox and radio state, submenu intent handling, direction-aware arrows, Escape handling, focus restoration, modal behavior, and form-safe button defaults. The COSS layer supplies the composed popup structure, public aliases, default offsets, exact classes, slots, icons, and convenience defaults.

Context7 was requested for current Svelte documentation as required by the repository guide. It returned `Monthly quota reached`, so the implementation uses the pinned local Svelte Edge references for runes, snippets, testing, libraries, and current Svelte 5 practices, together with the complete local Shards sources and tests.

The Codex in-app Browser backend was unavailable during the evidence pass. Selecting the required `iab` backend returned `Browser is not available`; the prescribed troubleshooting check exposed only a Chrome extension backend. Chrome was not used. Automated headless browser coverage therefore carries the behavioral checks until an in-app Browser session is available for the required manual comparison.

## Translation decisions

- The Svelte namespace is `Menu.Root`, `Menu.Trigger`, `Menu.Popup`, `Menu.Group`, `Menu.Label`, `Menu.Item`, `Menu.LinkItem`, `Menu.CheckboxItem`, `Menu.RadioGroup`, `Menu.RadioItem`, `Menu.Separator`, `Menu.Shortcut`, `Menu.Sub`, `Menu.SubTrigger`, and `Menu.SubPopup`. Long COSS names and Dropdown Menu aliases remain available from the component entry point.
- `Menu.Popup` preserves the COSS convenience composition: `Portal` → `Positioner` → `Popup` → scroll container. It defaults to `side="bottom"`, `align="center"`, and `sideOffset={4}` while forwarding popup, positioner, portal, anchor, ref, and native props to their correct owners.
- `Menu.SubPopup` uses `side="inline-end"`, `sideOffset={0}`, `align="start"`, and an `alignOffset` of `-5` unless the caller chooses centered alignment. Shards then owns RTL placement and submenu keyboard direction.
- Items, link items, labels, separators, shortcuts, checkbox items, radio items, sub-triggers, and both popup layers retain the complete COSS class strings and `data-slot` names. Consumer classes are merged last.
- Link items default `closeOnClick` to `true`, matching COSS rather than Shards' lower-level default.
- Checkbox `defaultChecked`, radio-group `defaultValue`, and root `defaultOpen` initialize state once with `untrack`. Bindable props and callback props remain usable together; Shards function bindings preserve veto behavior when a consumer declines a write.
- The checkbox `switch` variant keeps its indicator mounted so its unchecked track and thumb remain visible. The default checkbox and radio variants use the exact COSS checkmark path.
- `Menu.Trigger`, `Menu.Item`, and the other interactive wrappers forward Shards callback and native event props directly. No dispatcher or legacy Svelte event syntax is introduced.
- Shards owns the trigger and menu state, but its popup ID is not available to the trigger during SSR. The root therefore creates one hydration-stable `$props.id()` popup ID and shares it through a typed context with Trigger and Popup. This preserves `aria-controls` in open SSR output without mutable module state; an explicit popup or trigger `aria-controls` value still wins.

## Verification targets

- SSR structure and classes for every styled part and alias
- default-open, default-checked, default radio value, bindings, callbacks, and veto-capable function bindings
- trigger activation, item close behavior, checkbox and radio selection, disabled items, typeahead, nested submenus, RTL arrows, Escape, portal placement, and focus restoration
- no legacy Svelte syntax and no hydration warnings
