# Menu port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/menu.tsx`
- `reference/apps/ui/content/docs/components/menu.mdx`
- `reference/apps/ui/registry/default/particles/p-menu-1.tsx` through `p-menu-9.tsx`
- Every particle under `reference/apps/ui/registry/default/particles/` that imports the Menu wrapper: `p-breadcrumb-1`, `p-breadcrumb-4`, `p-dialog-2`, `p-drawer-13`, `p-group-1`, `p-group-3`, `p-group-4`, `p-group-5`, `p-group-6`, `p-group-13`, `p-input-group-17`, and `p-input-group-18`

The registry wrapper, documentation page, and each importer were read in full from the MIT-designated `reference/apps/ui/**` subtree. No source from the excluded COSS package subtree was used.

The nine direct particles cover the complete visible Menu surface: icons and shortcuts, disabled and destructive items, open-on-hover, checkbox and switch items, radio items, links, groups and labels, nested submenus, separators, and close-on-click behavior.

## Shards files inspected

The inspection covered every Menu implementation and type file under `shardsui/packages/shardsui/src/lib/components/menu/`, the complete Menu documentation, every Menu demo, all Menu tests, and all 92 Menu fixtures under `shardsui/packages/shardsui/tests/menu/fixtures/`.

Shards supplies the menu state machine, trigger semantics, portals, floating positioner, typeahead, roving focus, disabled-state handling, checkbox and radio state, submenu intent handling, direction-aware arrows, Escape handling, focus restoration, modal behavior, and form-safe button defaults. The COSS layer supplies the composed popup structure, public aliases, default offsets, exact classes, slots, icons, and convenience defaults.

Context7 was requested for current Svelte documentation as required by the repository guide. It returned `Monthly quota reached`, so the implementation uses the pinned local Svelte Edge references for runes, snippets, testing, libraries, and current Svelte 5 practices, together with the complete local Shards sources and tests.

Headless Chromium covers the automated interaction checks. The coordinator performs the final source-versus-port comparison in the Codex in-app browser. Chrome was not used.

## Translation decisions

- The Svelte namespace is `Menu.Root`, `Menu.Trigger`, `Menu.Popup`, `Menu.Group`, `Menu.Label`, `Menu.Item`, `Menu.LinkItem`, `Menu.CheckboxItem`, `Menu.RadioGroup`, `Menu.RadioItem`, `Menu.Separator`, `Menu.Shortcut`, `Menu.Sub`, `Menu.SubTrigger`, and `Menu.SubPopup`. Long COSS names and Dropdown Menu aliases remain available from the component entry point.
- `Menu.Popup` preserves the COSS convenience composition: `Portal` → `Positioner` → `Popup` → scroll container. It defaults to `side="bottom"`, `align="center"`, and `sideOffset={4}` while forwarding popup, positioner, portal, anchor, ref, and native props to their correct owners.
- `Menu.SubPopup` uses `side="inline-end"`, `sideOffset={0}`, `align="start"`, and an `alignOffset` of `-5` unless the caller chooses centered alignment. Shards then owns RTL placement and submenu keyboard direction.
- Items, link items, labels, separators, shortcuts, checkbox items, radio items, sub-triggers, and both popup layers retain the complete COSS class strings and `data-slot` names. Consumer classes are merged last.
- Link items default `closeOnClick` to `true`, matching COSS rather than Shards' lower-level default.
- Checkbox `defaultChecked`, radio-group `defaultValue`, and root `defaultOpen` initialize state once with `untrack`. Bindable props and callback props remain usable together; Shards function bindings preserve veto behavior when a consumer declines a write.
- The checkbox `switch` variant keeps its indicator mounted so its unchecked track and thumb remain visible. The default checkbox and radio variants use the exact COSS checkmark path.
- The playback and destructive particle icons use the exact current Lucide 0.555 SVG elements rendered by the published COSS examples, including the two Pause rectangles and the three-path Trash geometry.
- `Menu.Trigger`, `Menu.Item`, and the other interactive wrappers forward Shards callback and native event props directly. No dispatcher or legacy Svelte event syntax is introduced.
- `Menu.Handle<Payload>`, detached triggers, trigger payloads, and the root child snippet retain one `Payload` type end to end. Detached triggers work before and outside the root that owns their handle.
- Shards owns trigger registration and `aria-controls`. Only the active trigger advertises the open popup, including when several triggers share one root or handle. `Menu.Popup` uses `$props.id()` for a stable default ID and forwards explicit popup IDs unchanged; nested popups do the same.

## Verification targets

- SSR structure and classes for every styled part and alias
- default-open, default-checked, default radio value, bindings, callbacks, and veto-capable function bindings
- trigger activation, item close behavior, checkbox and radio selection, disabled items, typeahead, nested submenus, RTL arrows, Escape, portal placement, and focus restoration
- strict built-output consumption for every wrapper and named prop type
- no legacy Svelte syntax and no hydration warnings

## Hugeicons authority update

Default checkbox and radio indicators now use `Tick02Icon`, and submenu triggers use `ChevronRightIcon`, all through `HugeiconsIcon`. The migration keeps the COSS columns, margins, opacity, responsive sizing selectors, Shards state ownership, and keyboard behavior. The package wrappers and focused tests contain no legacy Lucide class or copied path marker.

## D8 documentation and particle port

The documentation lane freshly reread the complete permitted COSS Menu MDX page, all nine Menu particles, every importing particle, and the complete local Shards Menu source, documentation, demos, tests, 92 fixtures, and exported types. The Svelte page preserves the source preview order `1, 2, 3, 9, 4–8, p-dialog-2` and its exact headings and copy. The nine production particles keep the full playback menu, checkbox, radio, switch, link, hover-open, grouping, submenu, destructive, shortcut, and disabled examples, using Hugeicons throughout.

The source/SSR gate imports and renders every module. Browser coverage verifies persistent checkbox state, nested submenu arrows, Escape focus restoration, normal motion, and reduced motion. The Codex in-app Browser measured both source and Svelte basic triggers at `102.98×32` pixels with identical radius, padding, type, and line height; Shuffle changed to `aria-checked="true"`. Chrome was not used. The coordinator-owned documentation manifest still needs to enroll `components/menu`.
