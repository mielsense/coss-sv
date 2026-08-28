# Sheet port evidence

## Allowed COSS source

- `reference/apps/ui/registry/default/ui/sheet.tsx`
- `reference/apps/ui/content/docs/components/sheet.mdx`
- `reference/apps/ui/registry/default/particles/p-sheet-1.tsx`
- `reference/apps/ui/registry/default/particles/p-sheet-2.tsx`
- `reference/apps/ui/registry/default/particles/p-sheet-3.tsx`

Every listed file was read in full. No file under `reference/packages/ui/**` was opened or used.

## Local Shards source

Sheet uses Shards Dialog because COSS Sheet is a positioned Dialog. The complete local Dialog source, documentation, tests, fixtures, types, and demos were read before implementation. Shards owns the portal, focus management, nested-overlay behavior, dismissal, scroll lock, and transition lifecycle.

## Port contract

The Svelte port keeps the COSS Trigger, Close, Backdrop, Viewport, Popup, Header, Footer, Title, Description, and Panel classes and slots. `Popup` defaults to the right side, supports right, left, top, and bottom, and supports the default and inset variants. `Content` and `Overlay` remain aliases.

The public namespace uses `Sheet.Root` and named parts. Named `Sheet*` exports support direct imports. Root, Trigger, Handle, and `createHandle` preserve the Dialog payload generic. `Popup` owns the portal, backdrop, viewport, and optional close button, matching COSS. The optional close control keeps the shared Button's `data-slot="button"` marker.

## Parity checks

The fixture covers the default right sheet, inset sheet, and all four sides. Its four React `defaultValue` controls map to initialized Svelte bindings. Closing either owning Sheet resets its two bindings, so reopening restores the React defaults after an edit. Automated coverage checks the four initial values, an edit and close/reopen reset, the built-in close Button marker, SSR output, payload types, genuine SSR hydration, detached payloads, focus trap and restoration, escape and backdrop dismissal, side-specific DOM classes, inset classes, callback propagation, and accessible naming.

The coordinator inspected the live COSS route at `http://localhost:4000` and the Svelte target at `http://localhost:5410/preview/sheet` in the Codex in-app browser. Geometry, sides, styling, and focus behavior matched.

## Documentation lookup

Context7 was requested for current Svelte overlay and portal guidance. It returned `Monthly quota reached`, so the implementation uses the pinned Svelte Edge references and the complete local Shards Dialog material.

## Licensing

This port adapts only the MIT-designated COSS application source listed above. The Svelte behavior comes from the locally pinned Shards dependency.

## Hugeicons authority update

The optional close button now renders `Cancel01Icon` through `HugeiconsIcon`. The button retains its `Close` accessible name, slot, classes, dismissal behavior, and focus restoration; the glyph is decorative and uses `strokeWidth={2}`.

## D7 documentation lane

- Re-read the complete permitted page, particles `p-sheet-1` through `p-sheet-3`, every permitted dependency, and the complete local Shards Dialog and Drawer source, docs, tests, demos, fixtures, and types.
- Preserved all four sides, inset styling, modal and focus semantics, close controls, panel scrolling, and footer behavior. Shards has no Sheet primitive, so the page accurately links Shards Dialog, which underpins the package Sheet.
- D7 tests cover exact inventory, source restrictions, SSR, upstream page order, MDsveX compilation, and namespace APIs.
- The Codex in-app Browser runtime was unavailable in this worktree. Chrome was not used; headless production-browser coverage passed, and independent parity review must repeat manual inspection after integration.
