# Context Menu port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/context-menu.tsx`
- `reference/apps/ui/content/docs/components/context-menu.mdx`
- `reference/apps/ui/registry/default/particles/p-context-menu-1.tsx` through `p-context-menu-8.tsx`

The registry wrapper, documentation page, and every importing particle were read in full from `reference/apps/ui/**`. No AGPL-default package source was used.

The eight particles cover point-triggered opening, items and separators, links, nested submenus, checkbox items, grouped items and labels, icons and shortcuts, destructive styling, radio items, and the switch variant.

## Shards files inspected

The inspection covered every Context Menu implementation and type file under `shardsui/packages/shardsui/src/lib/components/context-menu/`, the complete Context Menu documentation and demos, all Context Menu tests, and all eight Context Menu fixtures. The shared Menu source, documentation, tests, demos, and fixtures were also inspected because Shards deliberately implements Context Menu as a point-triggered root and trigger over the same menu parts.

Shards owns right-click and long-press handling, the virtual point anchor, nested-trigger isolation, collision handling, menu focus management, keyboard interaction, and all shared menu item behavior. The COSS wrapper adds the exact visual contract, slots, convenience popup composition, variants, and aliases.

Context7 returned `Monthly quota reached`. The implementation therefore follows the pinned local Svelte Edge references and the complete local Shards implementation. Headless Chromium covers automated interaction checks; the coordinator performs the final comparison in the Codex in-app browser. Chrome was not used.

## Translation decisions

- The public namespace mirrors Menu: `ContextMenu.Root`, `Trigger`, `Popup`, `Group`, `Label`, `Item`, `LinkItem`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Separator`, `Shortcut`, `Sub`, `SubTrigger`, and `SubPopup`.
- `ContextMenu.Popup` composes Shards `Portal`, `Positioner`, and `Popup`, then inserts the exact COSS scroll container. Positioner, portal, anchor, and popup props are separated so each reaches the correct primitive.
- The root popup defaults to bottom/center with a four-pixel side offset. The submenu popup defaults to inline-end/start with a zero side offset and `-5` alignment adjustment, preserving direction-aware placement.
- Every COSS class string and `data-slot` value is preserved. Consumer classes are merged last.
- Checkbox, radio, link, disabled, destructive, shortcut, and switch behavior uses the same translation as Menu. Default state is read once, while bindable state, callbacks, and Shards' function-binding veto behavior stay available.
- The trigger forwards native element attributes and Shards' `as` and `ref` contracts. Shards remains the owner of pointer and touch anchors. A scoped reactive ID provider lives inside each root and submenu, so explicit and `$props.id()`-generated popup relationships are present during SSR and remain stable through hydration. Consumer-supplied `aria-controls` remains authoritative.
- `Shift+F10` and the Context Menu key open at the focused surface's center. Pointer invocation continues to use the event coordinates, while Shards supplies long-press handling and movement cancellation.
- The icon particle uses the exact current Lucide 0.555 Pencil, Copy, Share, and Trash SVG elements observed in the published COSS particle. The Edit and Delete shapes are not approximations from an older Lucide release.

## Verification targets

- contextmenu-event opening at the pointer, keyboard opening, long press, collision-safe placement, deep submenus, and focus restoration
- checkbox, switch, radio, disabled, destructive, links, shortcuts, submenus, RTL arrows, Escape, and typeahead
- exact SSR DOM, slots, classes, custom portal targets, keep-mounted content, stable explicit and generated root/submenu IDs, nested and sibling submenu relationships, and hydration

## Hugeicons authority update

Default checkbox and radio indicators use `Tick02Icon`; submenu triggers use `ChevronRightIcon`. Each icon is rendered by `HugeiconsIcon` with `aria-hidden="true"` and `strokeWidth={2}` while the COSS grid, margin, opacity, and responsive sizing classes remain on their original elements. The hydration fixture was regenerated from current SSR output so nested initially-open menus retain exact marker alignment.

## D8 documentation and particle port

The documentation lane freshly reread the complete permitted COSS Context Menu MDX page, all eight Context Menu particles, every consumer, and the complete local Shards Context Menu and shared Menu source, documentation, demos, tests, fixtures, and exported types. The Svelte page preserves the source order `1–8` and exact example copy. The production modules retain pointer opening, links, checkbox, switch, radio, group labels, icons, shortcuts, nested submenus, disabled and destructive rows, and Hugeicons.

Source/SSR coverage imports and renders every module. Browser coverage verifies pointer invocation and Escape dismissal in normal and reduced-motion modes. The production-preview gate verifies that the popup's horizontal center and four-pixel side offset originate from the real right-click point. The Codex in-app Browser measured both source and Svelte trigger surfaces at `384×128` pixels with a `10px` radius, and the Back item opened from a right click. Chrome was not used. The coordinator-owned documentation manifest still needs to enroll `components/context-menu`.
