# Parity fixture icon authority

## Scope

This record covers the icon-only migration in `apps/ui/src/lib/parity/components/**`, the package
Select scroll controls, and the package Sidebar trigger. It does not change component behavior,
registry particles, registry metadata, or shared navigation.

Owned fixtures audited:

- Alert, Autocomplete, Badge, Button, Card, Collapsible, Combobox, Command, Context Menu, Drawer,
  Empty, Field, Group, Input Group, Menu, Number Field, Popover, Preview Card, Select, Slider,
  Tabs, Toast, Toggle Group, Toggle, Toolbar, and Tooltip.
- `packages/ui/src/components/ui/sidebar/sidebar-trigger.svelte`.
- `packages/ui/src/components/ui/select/select-popup.svelte`.
- Radio Group's three `88 × 70` theme preview illustrations are content graphics, not glyphs, and
  remain inline SVG.

## Permitted COSS evidence

The complete matching source and documentation were reread only under
`reference/apps/ui/**`. The icon-bearing fixture source is in the registry JSON records for
`p-alert-3`, `p-autocomplete-14`, `p-autocomplete-16`, `p-badge-11`, `p-button-13` through
`p-button-16`, `p-card-1`, `p-card-10`, `p-card-11`, `p-collapsible-1`, `p-combobox-10`,
`p-combobox-13`, `p-combobox-14`, `p-combobox-17` through `p-combobox-20`, `p-command-1`,
`p-command-2`, `p-context-menu-6`, `p-drawer-13`, `p-empty-1`, `p-field-6`, `p-group-9`,
`p-group-10`, `p-group-16`, the matching Input Group particles, `p-menu-1`, the matching Number
Field and Popover particles, `p-preview-card-1`, the matching Select particles, `p-slider-11`,
`p-slider-14`, the icon-bearing Tabs particles, the matching Toast particles, the Toggle and
Toggle Group particles, `p-toolbar-1`, and `p-tooltip-2` through `p-tooltip-4`.

The semantic mappings retained from those sources are information, check, add, download, alert,
folder, disclosure, delete, edit, copy, share, route, book, direction, zoom, search, mail, text
formatting, visibility, playback, notification, user, star, repository fork, volume, home,
projects, settings, package, inbox, save, currency, and percent. All render with official
`@hugeicons/core-free-icons` data and `strokeWidth={2}` through the package's SSR-safe
`HugeiconsIcon` renderer.

COSS uses two different share glyphs. Context Menu and Drawer use the upload-style `ShareIcon`,
which maps to `Share03Icon`. Tooltip uses the three-node `Share2Icon`, which maps to
`Share08Icon`. The Input Group password control maps `EyeOffIcon` to the slashed
`ViewOffSlashIcon` rather than the unslashed closed-eye glyph. The address Autocomplete pin maps
to the two-node `Location01Icon`, and the detached Popover bell maps to `Notification01Icon` with
its closed body and clapper. COSS arrow-left and arrow-right glyphs map to the full-shaft
`ArrowLeft02Icon` and `ArrowRight02Icon` datasets.

The Preview Card fork count maps COSS `CornerUpLeftIcon` to Hugeicons `CornerUpLeftIcon`. The
Slider reset maps `RotateCcwIcon` to the identically named Hugeicons dataset, and the Slider add
button shares `Add01Icon` with the other COSS `PlusIcon` sites. Select's scroll controls use
`ChevronUpIcon` and `ChevronDownIcon`, preserving the COSS semantic icon identities. The occurrence
Popover uses `ChevronDownIcon` for the same reason.
The same rule covers the copied Select markup in the Card, Number Field, and Toolbar parity
fixtures.

No source under `reference/packages/ui/**` was read or used.

## Shards evidence

The complete matching Shards implementation, exports, examples, types, and tests were reread for
Autocomplete, Combobox, Context Menu, Menu, Select, Toolbar, Tooltip, Collapsible, Popover, Tabs,
Slider, and the associated selection primitives under
`shardsui/packages/shardsui/src/lib/components/**`, `shardsui/packages/shardsui/tests/**`, and the
matching documentation. The migration leaves primitive ownership, event handling, focus,
attachments, portals, and state contracts unchanged; only glyph rendering is replaced.

## Implementation and verification

`fixture-icon.svelte` owns the parity-only semantic map and delegates every glyph to the public
central renderer. The package Sidebar trigger imports the same renderer internally through
`$lib/hugeicons-icon.svelte`. Source tests enumerate every migrated fixture, reject direct
`@hugeicons/svelte` imports and copied glyph markup, preserve the three theme illustrations, and
bind all 204 icon component and snippet sites to explicit official datasets. The contract includes
popup-only, conditional, and dynamic sites that closed-state SSR does not emit, plus the direct
core icon sites in Autocomplete, Combobox, Command, and Select. Each direct site must declare the
literal `strokeWidth={2}` binding. Every contract count and dataset list must be nonzero. The test
server-renders each bound dataset and the real Sidebar provider fixture, then compares the complete
node geometry and stroke-two output. A missing site, changed stroke binding, empty render, or
different glyph fails the test.

A separate high-risk authority table records each permitted COSS source site, its imported COSS
icon name, the chosen Hugeicons export, the target source fragments, and a SHA-256 hash of the
official icon data. This table covers the distinct share glyphs, eye-off, address pin, bell,
full-shaft horizontal arrows, Preview Card fork, Slider reset and add, Select scroll controls, and
the Sidebar trigger. The Select entries count the canonical package popup and all three copied
fixture implementations. The table does not derive expectations from the semantic fixture map.
