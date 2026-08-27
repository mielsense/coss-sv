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

The public namespace uses `Sheet.Root` and named parts. Named `Sheet*` exports support direct imports. `Popup` owns the portal, backdrop, viewport, and optional close button, matching COSS.

## Parity checks

The fixture covers the default right sheet, inset sheet, and all four sides. Automated coverage checks SSR output, types, hydration, focus trap and restoration, escape and backdrop dismissal, side-specific DOM classes, inset classes, callback propagation, and accessible naming.

The Codex in-app browser was requested for live inspection at `http://localhost:4000`. The browser runtime returned `Browser is not available: iab`, so no external browser was substituted. The coordinator must repeat the live source-versus-target check when the in-app browser is available. The target route is `http://localhost:5410/preview/sheet` after shared preview registration.

## Documentation lookup

Context7 was requested for current Svelte overlay and portal guidance. It returned `Monthly quota reached`, so the implementation uses the pinned Svelte Edge references and the complete local Shards Dialog material.

## Licensing

This port adapts only the MIT-designated COSS application source listed above. The Svelte behavior comes from the locally pinned Shards dependency.
