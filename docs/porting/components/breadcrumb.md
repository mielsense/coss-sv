# Breadcrumb port evidence

## Sources inspected

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/breadcrumb.tsx`
- Documentation: `reference/apps/ui/content/docs/components/breadcrumb.mdx`
- Particles: `reference/apps/ui/registry/default/particles/p-breadcrumb-1.tsx` through `p-breadcrumb-7.tsx`
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Closest Shards source: every file under `shardsui/packages/shardsui/src/lib/components/menu/`, including the public parts, root, trigger, popup, item, link item, submenu, positioner, portal, context, state, and exported types
- Shards tests: the focused root, trigger, item, link-item, popup, positioner, submenu-trigger, and typeahead tests under `shardsui/packages/shardsui/tests/menu/`, with `fixtures/basic-menu.svelte`, `menu-with-link-items.svelte`, and `menu-with-submenu.svelte`
- Shards documentation and examples: `shardsui/docs/src/content/menu.md`, `shardsui/docs/src/lib/components/content/demos/menu/hero/demo.svelte`, and the submenu demo

The search covered every COSS application-tree import of the Breadcrumb barrel. Generated registry JSON was not used as source, and no file under `reference/packages/ui` was read.

## COSS contract

The compound component is a native landmark and ordered list. It exports `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, and `BreadcrumbEllipsis`. Each part keeps its source tag, exact class list, and `data-slot`. The root defaults to `aria-label="breadcrumb"`; the page carries `aria-current="page"`; separators and the ellipsis are presentational and hidden from the accessibility tree. The default chevron and ellipsis SVG DOM match the rendered Lucide output, including class names, path or circle data, and `aria-hidden`.

React's `render` prop on `BreadcrumbLink` becomes the typed Svelte `as` prop. The default remains an anchor. Consumer classes merge last through `cn`, native attributes and callback props are forwarded, and every element has a deliberate bindable ref. The local barrel provides the COSS names plus `Root`, `List`, `Item`, `Link`, `Page`, `Separator`, and `Ellipsis` aliases for namespace imports.

Breadcrumb itself has no headless state, focus management, or keyboard logic. The primary particle adds those behaviors exactly where COSS does: around `BreadcrumbEllipsis`. Its Svelte composition uses Shards `Menu.Root`, `Menu.Trigger`, `Menu.Portal`, `Menu.Positioner`, `Menu.Popup`, and `Menu.LinkItem`. `Menu.LinkItem` is the typed Shards equivalent of Base UI `Menu.Item` rendered as a Next link. It closes on click and keeps COSS's `data-slot="menu-item"`. The trigger and popup retain the COSS button and menu classes and `data-slot` attributes.

## Browser evidence

Reference: `http://127.0.0.1:4000/ui/docs/components/breadcrumb`

Svelte: `http://127.0.0.1:5102/preview/breadcrumb?theme=<light|dark>&width=<mobile|desktop>`

The Codex in-app Browser was used for the manual reference pass. No Chrome session was used. At desktop width, COSS computes a 332.05 by 20 pixel list, 14 pixel list font, 10 pixel responsive gap, 6 pixel item gap, 16 pixel separators, and a 28 pixel trigger. At 390 by 844, the reference docs give the particle 308 pixels of content width. Its 32 pixel trigger makes the list wrap to exactly 308 by 46 pixels with a 6 pixel gap. The Svelte review shell uses the same 308 pixel mobile content width without adding styles to the particle. The primary fixture places `BreadcrumbEllipsis` inside the Shards menu trigger and renders the exact Docs and Particles menu items through its portal, positioner, and popup. Keyboard order is Home, menu trigger, then Components. Arrow Down opens the menu and focuses Docs; Escape closes it and restores focus to the trigger.

The upstream particle has one accessibility defect that the port preserves for exact parity. `BreadcrumbEllipsis` puts its visible icon and the `sr-only` text `More` inside a span with `aria-hidden="true"`, so the enclosing menu-trigger button has no accessible name. The focused axe check disables only `button-name` and runs every other rule. This evidence does not treat the unnamed trigger as acceptable library design; changing it needs a recorded parity decision.

The reference server stayed locked to dark mode when its visible theme control was activated, so the manual source comparison covered dark desktop/mobile. The deterministic Svelte route and E2E suite cover light and dark at both widths. Console and hydration logs were empty. Axe reports no violations after the exact upstream `button-name` exception described above.

## Test coverage

- red-first SSR tests for every export, exact tags, classes, state attributes, prop precedence, custom separators, and SVG output;
- type tests for snippets, native attributes and callbacks, dynamic link rendering, and refs;
- browser tests for callbacks, refs, snippets, hydration, and dynamic element rendering;
- Playwright coverage for light/dark, desktop/mobile, keyboard order, geometry, axe, and console errors.

Accepted translations: React `render` on `BreadcrumbLink` becomes the typed Svelte `as` prop. The particle's Base UI `Menu.Item` rendered as a Next link becomes Shards `Menu.LinkItem` with `closeOnClick` and COSS's `data-slot="menu-item"`. The native tags, visible classes, menu roles, focus order, and link behavior remain the same.

## Hugeicons authority update

The default separator and ellipsis now use `ChevronRightIcon` and `MoreHorizontalIcon` through `HugeiconsIcon`. Both remain decorative, keep the COSS size and opacity classes, and preserve the custom-separator snippet contract. Focused source and mounted-browser checks reject copied paths and legacy Lucide markers.

## D9 documentation and particle pass

The D9 lane re-read the complete permitted Breadcrumb component, MDX page, all seven particles, every permitted consumer, and the complete Shards Menu source, tests, fixtures, examples, documentation, and types before writing the registry examples. The Svelte page preserves the primary and custom-separator preview order. All seven particles use the package implementation and Hugeicons; the menu example keeps real Shards focus and keyboard behavior. Focused D9 source, SSR, and MDsveX tests cover the complete inventory. The Codex in-app Browser control was not exposed in this subagent session, so no Chrome substitute was used and manual visual comparison remains required during integration review.
