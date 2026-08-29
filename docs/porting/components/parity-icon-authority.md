# Parity fixture icon authority

## Scope

This record covers the icon-only migration in `apps/ui/src/lib/parity/components/**` and the
package Sidebar trigger. It does not change component behavior, registry particles, registry
metadata, or shared navigation.

Owned fixtures audited:

- Alert, Autocomplete, Badge, Button, Card, Collapsible, Combobox, Command, Context Menu, Drawer,
  Empty, Field, Group, Input Group, Menu, Number Field, Popover, Preview Card, Select, Slider,
  Tabs, Toast, Toggle Group, Toggle, Toolbar, and Tooltip.
- `packages/ui/src/components/ui/sidebar/sidebar-trigger.svelte`.
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
`ViewOffSlashIcon` rather than the unslashed closed-eye glyph.

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
bind each fixture to its COSS semantic icon names. The test renders all 26 fixtures and the real
Sidebar provider fixture on the server. It also checks every semantic name against the complete
official Hugeicons geometry at `strokeWidth={2}`, so a different glyph fails even when it uses the
same renderer.
