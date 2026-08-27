# Drawer port evidence

## Allowed COSS source

- `reference/apps/ui/registry/default/ui/drawer.tsx`
- `reference/apps/ui/content/docs/components/drawer.mdx`
- `reference/apps/ui/registry/default/particles/p-drawer-1.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-2.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-3.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-4.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-5.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-6.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-7.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-8.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-9.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-10.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-11.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-12.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-13.tsx`
- `reference/apps/ui/registry/default/particles/p-drawer-14.tsx`

Every listed file was read in full. No file under `reference/packages/ui/**` was opened or used.

## Local Shards source

The complete `shardsui/packages/shardsui/src/lib/components/drawer/` directory, Drawer documentation, all Drawer tests and fixtures, and every Drawer demo were read before implementation. Shards owns pointer and touch tracking, directional dragging, velocity dismissal, snap points, nested drawer transforms, focus management, portal behavior, scroll locking, selection handling, and transition lifecycle attributes.

## Port contract

The Svelte root maps COSS positions to Shards swipe directions: bottom to down, top to up, left to left, and right to right. It supports default and controlled open state, snap points, controlled snap point, sequential snapping, modal and non-modal modes, detached handles, and change callbacks.

The styled parts keep the COSS classes and slots for Trigger, Close, SwipeArea, Backdrop, Viewport, Popup, Header, Footer, Title, Description, Panel, Bar, and Content. Popup supports default, straight, and inset variants. It can show an optional bar and close button. Panel preserves COSS selection and scrolling options while delegating swipe coordination to Shards Content. `Overlay` remains a Backdrop alias.

The namespace also includes the COSS drawer menu helpers used by the responsive menu example: Menu, MenuItem, Separator, Group, GroupLabel, MenuTrigger, CheckboxItem, RadioGroup, and RadioItem. Those helpers compose existing Svelte components instead of reimplementing their interaction logic.

## Parity checks

The fixture covers bars, every direction, default and inset shells, scrollable content, nested drawers, snap points, footer variants, responsive navigation, responsive Dialog fallback, menu helpers, and a non-modal edge SwipeArea. Automated coverage checks SSR output, types, hydration, focus trap and restoration, escape and backdrop dismissal, directional pointer dragging, snap points, nested overlays, non-modal behavior, selection handling, callback propagation, and accessible naming.

The Codex in-app browser was requested for live inspection at `http://localhost:4000`. The browser runtime returned `Browser is not available: iab`, so no external browser was substituted. The coordinator must repeat the live source-versus-target check when the in-app browser is available. The target route is `http://localhost:5410/preview/drawer` after shared preview registration.

## Motion and reduced motion

No custom motion library is needed. Shards supplies gesture transforms and state attributes, while the copied COSS class strings supply CSS transitions. The package-wide reduced-motion rule remains authoritative. Tests verify that the wrapper does not add JavaScript animation on top of Shards.

## Documentation lookup

Context7 was requested for current Svelte overlay, pointer, and portal guidance. It returned `Monthly quota reached`, so the implementation uses the pinned Svelte Edge references and the complete local Shards material.

## Licensing

This port adapts only the MIT-designated COSS application source listed above. The Svelte behavior comes from the locally pinned Shards dependency.
