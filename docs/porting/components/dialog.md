# Dialog port evidence

## Allowed COSS source

- `reference/apps/ui/registry/default/ui/dialog.tsx`
- `reference/apps/ui/content/docs/components/dialog.mdx`
- `reference/apps/ui/registry/default/particles/p-dialog-1.tsx`
- `reference/apps/ui/registry/default/particles/p-dialog-2.tsx`
- `reference/apps/ui/registry/default/particles/p-dialog-3.tsx`
- `reference/apps/ui/registry/default/particles/p-dialog-4.tsx`
- `reference/apps/ui/registry/default/particles/p-dialog-5.tsx`
- `reference/apps/ui/registry/default/particles/p-dialog-6.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-12.tsx`, which imports Dialog for its wide-screen branch

Every listed file was read in full. No file under `reference/packages/ui/**` was opened or used.

## Local Shards source

The complete `shardsui/packages/shardsui/src/lib/components/dialog/` directory, Dialog documentation, all Dialog tests and fixtures, and every Dialog demo were read before implementation. Shards supplies the portal, nested-overlay accounting, focus trap and restoration, outside-press handling, escape-key dismissal, scroll lock, initial and final focus targets, detached handles, and transition lifecycle attributes.

## Port contract

The Svelte port keeps the COSS composition and class strings for Trigger, Close, Backdrop, Viewport, Popup, Header, Footer, Title, Description, and Panel. `Popup` owns the portal, backdrop, viewport, and optional close button, as COSS does. The optional close control keeps the shared Button's `data-slot="button"` marker. Popup defaults to the mobile bottom-sticking layout and exposes `bottomStickOnMobile`, `showCloseButton`, `closeProps`, and `portalProps`. `Content` and `Overlay` remain aliases.

The public Svelte namespace uses `Dialog.Root`, `Dialog.Trigger`, `Dialog.Popup`, and the remaining named parts. Named `Dialog*` exports remain available for direct imports. Root, Trigger, Handle, and `createHandle` retain Shards' payload generic instead of widening payloads to `unknown`. The implementation delegates behavior to Shards rather than recreating focus or dismissal logic.

## Parity checks

The fixture covers the default profile form, controlled menu dialog, nested dialogs, close confirmation with Alert Dialog, scrollable terms, and the bare footer. The six React `defaultValue` inputs map to initialized Svelte bindings. Closing each owning popup resets its bindings, so reopening restores the React defaults after an edit. Automated coverage checks the six initial values, an edit and close/reopen reset, the built-in close Button marker, SSR output, payload generics, genuine SSR hydration, detached payloads, controlled close veto, custom initial and final focus, modal scroll locking and cleanup, non-modal dismissal, focus trapping and restoration, escape and backdrop dismissal, nested overlays, callback propagation, and accessible names.

The coordinator inspected the live COSS route at `http://localhost:4000` and the Svelte target at `http://localhost:5410/preview/dialog` in the Codex in-app browser. Geometry, styling, and focus behavior matched; automated repair coverage now guards the payload and initial-value contracts found during review.

## Documentation lookup

Context7 was requested for current Svelte overlay and portal guidance. It returned `Monthly quota reached`, so the implementation uses the pinned Svelte Edge references and the complete local Shards source, documentation, tests, fixtures, and demos.

## Licensing

This port adapts only the MIT-designated COSS application source listed above. The Svelte behavior comes from the locally pinned Shards dependency.
