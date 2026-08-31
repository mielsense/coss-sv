# Sidebar port evidence

## Source record

- COSS revision: `19620ae8cae81e30775f2cde03829326cb4916b2`.
- Shards UI revision: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`.
- COSS implementation: `reference/apps/ui/registry/default/ui/sidebar.tsx`, read in full.
- Responsive hook: `reference/apps/ui/registry/default/hooks/use-media-query.ts`, read in full.
- Shipped consumer: `reference/apps/ui/components/docs-sidebar.tsx` and `reference/apps/ui/app/docs/layout.tsx`, read in full.
- COSS Sidebar skill reference: `reference/apps/ui/skills/coss/references/primitives/sidebar.md`, read in full.
- COSS has no Sidebar documentation page and no dedicated `p-sidebar-*` particle family at this revision. A repository-wide search under the permitted `reference/apps/ui/**` boundary found no particle importing the Sidebar module.

The implementation does not use the excluded COSS package subtree or another AGPL-default path.

## Upstream API and defaults

The registry file exports `SidebarProvider`, `Sidebar`, `useSidebar`, `SidebarTrigger`, `SidebarRail`, `SidebarInset`, `SidebarInput`, `SidebarHeader`, `SidebarFooter`, `SidebarSeparator`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubItem`, and `SidebarMenuSubButton`.

Provider defaults and constants:

- desktop width: `16rem`;
- mobile width: `18rem`;
- icon width: `3rem`;
- desktop open state: `true`;
- mobile breakpoint: `max-md`, which resolves to at most `799px`;
- keyboard shortcut: Control or Command plus `b`;
- persistence cookie: `sidebar_state`, path `/`, maximum age seven days.

The context exposes `state`, `open`, `setOpen`, `openMobile`, `setOpenMobile`, `isMobile`, and `toggleSidebar`. A consumer outside the provider must receive the exact error `useSidebar must be used within a SidebarProvider.`

`Sidebar` supports left and right sides, `sidebar`, `floating`, and `inset` variants, plus `offcanvas`, `icon`, and `none` collapse modes. Desktop collapse is expressed through `data-state`, `data-side`, `data-variant`, and `data-collapsible`. Mobile state is a modal edge drawer with an accessible title and description.

## Rendered reference inspection

The live COSS documentation shell was inspected with the Codex in-app browser at widths 1440, 1024, 1023, 800, 799, and 375 pixels. No external browser was used.

- At 1440px the non-collapsible docs Sidebar measured `256 x 836` at `x=12, y=64`.
- At 1024px it measured `256 x 836` at `x=0, y=64`.
- At 1023px and below the docs consumer's `lg:flex` class hides the Sidebar. The provider changes from its two-column grid to flex layout.
- The page had no horizontal overflow at the measured widths.
- Direct navigation to `/ui/docs/components/sidebar` returned the upstream `Page Not Found` page, confirming that this revision has no standalone Sidebar page.

The docs consumer uses `collapsible="none"`, a sticky shell, `SidebarContent` with scroll fade, grouped labels, active menu links, and New badges. The registry source remains the authority for collapse, rail, shortcut, tooltip, and mobile drawer behavior because the live site does not expose a dedicated Sidebar demo.

## Class and state inventory

The Svelte port preserves the complete COSS class strings from the registry file, including:

- wrapper width variables and `has-data-[variant=inset]` background behavior;
- desktop gap and fixed container transitions;
- side-aware borders, off-canvas offsets, icon widths, and resize cursors;
- floating and inset padding, radius, and shadow rules;
- group label collapse animation and group action hit area;
- menu button `default` and `outline` variants with `sm`, `default`, and `lg` sizes;
- active, disabled, open, hover, focus-visible, action, badge, nested-menu, and icon-collapse selectors;
- rail hit target and side-aware cursor changes;
- skeleton icon and text slots with a width in the upstream 50 to 89 percent range.

The existing package theme already defines the required `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, and `--sidebar-ring` tokens.

## Shards and package mapping

The complete local Shards component source, API documentation, tests, examples, and exported parts were inspected for button, collapsible, drawer, input, menu, separator, and tooltip. Shards has no skeleton primitive. The existing COSS Svelte Skeleton wrapper was inspected instead. The existing package wrappers for every dependency were also read before composition.

- Provider, desktop layout, structural groups, menu rows, badges, actions, rail, and inset remain semantic Svelte elements.
- Mobile mode composes the existing Shards-backed Drawer wrapper. The drawer owns focus trapping, Escape and outside dismissal, focus restoration, modal semantics, and edge swipe behavior.
- `SidebarInput`, `SidebarSeparator`, `SidebarMenuSkeleton`, and `SidebarTrigger` compose the existing Input, Separator, Skeleton, and Button wrappers.
- `SidebarMenuButton` uses the existing Shards-backed Tooltip wrappers only when a tooltip is supplied and the native button is enabled. A disabled menu button remains a native disabled button, so it keeps browser focus, click, attribute, and style semantics without activating the tooltip. The popup is otherwise hidden unless the desktop Sidebar is collapsed.
- `SidebarContent` preserves the upstream ScrollArea composition with `fill`, `overscrollContain`, and `scrollFade`.
- Nested disclosures are consumer compositions using the existing Collapsible wrapper. Menu popups remain available through the existing Menu package; Sidebar's own `SidebarMenu*` parts are the native list structure defined by COSS.

## Svelte API translation

- The local barrel exposes the namespace API as `Sidebar.Provider`, `Sidebar.Root`, `Sidebar.Trigger`, and the remaining part names. COSS-style named aliases are exported from the same local barrel.
- `open` is deliberately bindable on `Provider`; `onOpenChange` remains available for one-way consumers. `defaultOpen` is read once.
- `openMobile` stays internal, matching COSS. The context exposes setters for compound parts and advanced consumers.
- The polymorphic action and menu surfaces deliberately support the non-void semantic tags they need. `GroupAction`, `MenuAction`, `MenuButton`, and `MenuSubButton` accept anchors or buttons; `GroupLabel` accepts a div, label, or span. Their generic prop types select the matching `SvelteHTMLElements[Tag]` attributes. Links use `as="a"` and preserve `href`, `target`, `rel`, and `download` without adding button semantics.
- Per-provider mutable state lives in component context. No request-specific state is stored in module scope.
- The skeleton width is derived from `$props.id()` into the same 50 to 89 percent range. This preserves the visible contract while avoiding `Math.random()` server and hydration drift.
- The trigger maps COSS's Panel Left glyph to Hugeicons `SidebarLeftIcon`, rendered through `@hugeicons/svelte` with the reference's two-pixel stroke geometry. The icon is loaded from the package's per-icon export so browser dependency optimization does not parse the full icon barrel.
- In mobile mode, native Sidebar root attributes, events, ARIA, IDs, data attributes, and consumer styles are forwarded to the Drawer popup. The consumer style is merged with the mobile `--sidebar-width: 18rem` declaration.
- The package build emits a dedicated `sidebar-separator.svelte.d.ts` with the exported `SidebarSeparatorProps` alias. A strict external Svelte consumer test covers that declaration and every polymorphic link surface.

## Test contract

Focused tests cover:

- provider context and the missing-provider error;
- uncontrolled, controlled, and bindable desktop state;
- the Control or Command plus `b` shortcut;
- seven-day `sidebar_state` cookie persistence;
- off-canvas, icon, none, floating, inset, left, and right output states;
- mobile drawer semantics, dismissal, focus restoration, and independent mobile state;
- trigger and rail interaction;
- every structural menu part, active and disabled states, action buttons, badges, nested groups, and deterministic skeleton output;
- collapsed-only tooltip behavior and focus opening;
- native disabled behavior when a menu button also has tooltip content;
- mobile native prop, event, ARIA, ID, data-attribute, and style forwarding;
- built declaration output and strict external-consumer polymorphic typing;
- Hugeicons two-pixel path geometry;
- native attribute, class, snippet, callback, and ref forwarding;
- server rendering and hydration without warnings.

## Deviations

None.
