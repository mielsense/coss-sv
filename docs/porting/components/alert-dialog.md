# Alert Dialog port evidence

## Allowed COSS source

- `reference/apps/ui/registry/default/ui/alert-dialog.tsx`
- `reference/apps/ui/content/docs/components/alert-dialog.mdx`
- `reference/apps/ui/registry/default/particles/p-alert-dialog-1.tsx`
- `reference/apps/ui/registry/default/particles/p-alert-dialog-2.tsx`
- `reference/apps/ui/registry/default/particles/p-dialog-4.tsx`, which nests Alert Dialog in Dialog

Every listed file was read in full. No file under `reference/packages/ui/**` was opened or used.

## Local Shards source

The complete `shardsui/packages/shardsui/src/lib/components/alert-dialog/` directory, its Dialog-backed parts, Alert Dialog documentation, all tests and fixtures, and every demo were read before implementation. Shards fixes the role to `alertdialog`, enforces modal focus behavior, disables pointer dismissal, and restores focus to the trigger.

## Port contract

The Svelte port keeps the COSS Trigger, Backdrop, Viewport, Popup, Header, Footer, Title, Description, and Close classes and slots. `Popup` owns the portal, backdrop, and viewport. It defaults to the mobile bottom-sticking layout. `Content` and `Overlay` remain aliases.

The public namespace uses `AlertDialog.Root` and named parts. Named `AlertDialog*` exports support direct imports. Root, Trigger, Handle, and `createHandle` preserve the payload generic. Alert dialogs do not dismiss on backdrop press. Escape and explicit Close controls dismiss them, matching the pinned Shards contract.

## Parity checks

The fixture contains the exact default and bare-footer examples. Automated coverage checks SSR output, payload types, genuine SSR hydration, detached payloads, `alertdialog` semantics, initial focus, focus trapping and restoration, escape dismissal, backdrop non-dismissal, explicit cancellation, and callback propagation.

The coordinator inspected the live COSS route at `http://localhost:4000` and the Svelte target at `http://localhost:5410/preview/alert-dialog` in the Codex in-app browser. Geometry, styling, and focus behavior matched.

## Documentation lookup

Context7 was requested for current Svelte overlay and portal guidance. It returned `Monthly quota reached`, so the implementation uses the pinned Svelte Edge references and the complete local Shards material.

## Licensing

This port adapts only the MIT-designated COSS application source listed above. The Svelte behavior comes from the locally pinned Shards dependency.

## D7 documentation lane

- Re-read the complete permitted page, `p-alert-dialog-1`, `p-alert-dialog-2`, shared `p-dialog-4`, every permitted dependency, and the complete local Shards Alert Dialog source, docs, tests, demos, fixtures, and types.
- Preserved modal response semantics, focus return, Escape and outside-interaction behavior, mobile placement, footer variants, destructive actions, and non-empty message confirmation. The page order matches upstream; `p-dialog-4` remains Dialog-owned.
- D7 tests cover inventory, source restrictions, SSR, page order, MDsveX compilation, APIs, focus, Escape, cancellation, and focus return.
- The Codex in-app Browser runtime was unavailable in this worktree. Chrome was not used; headless production-browser coverage passed, and independent parity review must repeat manual inspection after integration.
