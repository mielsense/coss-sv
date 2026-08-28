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

The Svelte root maps COSS positions to Shards swipe directions: bottom to down, top to up, left to left, and right to right. It supports default and controlled open state, snap points, controlled snap point, sequential snapping, modal and non-modal modes, detached handles, and change callbacks. Root, Trigger, Handle, and `createHandle` retain the payload generic through generated declarations.

The styled parts keep the COSS classes and slots for Trigger, Close, SwipeArea, Backdrop, Viewport, Popup, Header, Footer, Title, Description, Panel, Bar, and Content. Popup supports default, straight, and inset variants. It can show an optional bar and close button. The optional close control keeps the shared Button's `data-slot="button"` marker. Panel preserves COSS selection and scrolling options while delegating swipe coordination to Shards Content. `Overlay` remains a Backdrop alias.

The namespace also includes the COSS drawer menu helpers used by the responsive menu example: Menu, MenuItem, Separator, Group, GroupLabel, MenuTrigger, CheckboxItem, RadioGroup, and RadioItem. `defaultValue` and `defaultChecked` are read once and translated to Shards' controlled bindings; the Artist option therefore starts selected in the responsive menu. The p-drawer-11 React source nests Button and Link inside DrawerClose. Fresh runtime inspection showed that Base UI merges this to `<a data-slot="drawer-close" role="button" tabindex="0" href="#">`. The Svelte particle uses `Drawer.Close as="a"` to match. The standalone p-drawer-14 links retain the shared Button's `data-slot="button"` marker.

## Parity checks

The fixture covers bars, every direction, default and inset shells, scrollable content, nested drawers, snap points, footer variants, responsive navigation, responsive Dialog fallback, menu helpers, and a non-modal edge SwipeArea. The nested member form keeps the React particles' two exact `defaultValue` props, including the `type="email"` control, while the other six visible controls use popup-scoped Svelte bindings. Closing the owning Drawer or responsive Dialog remounts those controls, so reopening restores every reference default after an edit. Automated coverage checks all eight initial values, the real email input's edit, Cancel, focus restoration, and reopen lifecycle, the built-in close Button marker, payload types, SSR output, genuine SSR hydration, detached payloads, focus trap and restoration, escape and backdrop dismissal, real pointer drags in all four directions, real touch opening and dismissal, sequential snap transitions, computed nested stack scaling and restoration, nested-trigger focus restoration, non-modal behavior, menu keyboard changes, selection handling, callback propagation, and accessible naming.

The coordinator inspected the live COSS route at `http://localhost:4000` and the Svelte target at `http://localhost:5410/preview/drawer` in the Codex in-app browser. Geometry, styling, directions, and focus behavior matched.

## Motion and reduced motion

No custom motion library is needed. Shards supplies gesture transforms and state attributes, while the copied COSS class strings supply CSS transitions. A fresh search of the allowed COSS component and particle sources found no component-level `prefers-reduced-motion` override. The port deliberately keeps that exact CSS contract instead of inventing different motion. The documentation preview's motion probe has its own reduced-motion rule, but it does not alter Drawer. This upstream parity decision should be revisited only as a coordinated accessibility change to both reference expectations and target behavior.

## Documentation lookup

Context7 was requested for current Svelte overlay, pointer, and portal guidance. It returned `Monthly quota reached`, so the implementation uses the pinned Svelte Edge references and the complete local Shards material.

## Licensing

This port adapts only the MIT-designated COSS application source listed above. The Svelte behavior comes from the locally pinned Shards dependency.

## Hugeicons authority update

Drawer close, menu selection, and nested-menu affordances now use `Cancel01Icon`, `Tick02Icon`, and `ChevronRightIcon` through `HugeiconsIcon`. The icons remain decorative and keep the COSS indicator columns, trigger margin and opacity, responsive sizing selectors, and gesture behavior.
