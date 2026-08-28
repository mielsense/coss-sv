# Tooltip porting evidence

## Source record

- COSS revision: `19620ae8cae81e30775f2cde03829326cb4916b2`.
- Shards revision: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`.
- COSS component and page: `reference/apps/ui/registry/default/ui/tooltip.tsx` and `reference/apps/ui/content/docs/components/tooltip.mdx`.
- Direct particles: `p-tooltip-1.tsx` through `p-tooltip-4.tsx`.
- Other importing particles read in full: `p-button-40.tsx`, `p-group-2.tsx`, `p-group-12.tsx`, `p-input-9.tsx`, `p-input-group-8.tsx`, `p-input-group-17.tsx`, `p-input-group-21.tsx`, `p-input-group-23.tsx`, `p-input-group-27.tsx` through `p-input-group-29.tsx`, `p-switch-7.tsx` through `p-switch-9.tsx`, `p-tabs-13.tsx`, `p-toast-7.tsx`, `p-toast-12.tsx`, `p-toast-13.tsx`, `p-toggle-8.tsx`, `p-toggle-group-9.tsx`, and `p-toolbar-1.tsx`.
- Shards source: every file under `shardsui/packages/shardsui/src/lib/components/tooltip/`.
- Shards docs and demos: `shardsui/docs/src/content/tooltip.md` and every demo under `shardsui/docs/src/lib/components/content/demos/tooltip/`.
- Shards behavior evidence: every test and fixture under `shardsui/packages/shardsui/tests/tooltip/`, including delay groups, focus and hover opening, interactive boundaries, disabled state, cursor tracking, detached handles, portal targets, positioning, lifecycle, and viewport transitions.

Context7 returned `Monthly quota reached`. Manual inspection at `http://localhost:4000/docs/components/tooltip` was attempted only through the Codex in-app Browser. No in-app Browser instance was available, and Chrome was not used.

## Upstream contract

COSS exports `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipPopup`, `TooltipContent`, `TooltipCreateHandle`, and `TooltipPrimitive`. `TooltipPopup` owns `Portal → Positioner → Popup → Viewport`. Defaults are `side="top"`, centered alignment, and a four-pixel side offset.

The direct particles cover a standard tooltip, grouped formatting controls, detached animated formatting payloads, and a right-side vertical share group. Other particles require zero-delay providers, per-trigger delay, disabled triggers, `disableHoverablePopup`, nested overlay triggers, focusable toolbar composition, and dynamic accessible labels.

Tooltips open on mouse hover after the configured rest delay and immediately on keyboard focus. Touch does not synthesize hover opening. Escape and trigger press dismiss. The default safe polygon allows the pointer to cross into tooltip content; `disableHoverablePopup` removes that interactive boundary. A provider changes adjacent tooltips to the instant phase for 400 ms by default. Tooltip text is exposed as the trigger's accessible description through Shards-generated relationships.

## Class and state inventory

- Positioner: exact COSS position size variables, available width, coordinate transition, and `data-instant:transition-none`.
- Popup: exact COSS popup dimensions, transform origin, balanced text, medium radius, border/background/tokens, extra-small text, shadow, pseudo-element highlights, starting/ending scale and opacity, and instant duration.
- Viewport: exact inline padding, current/previous width and opacity selectors, previous-content truncation, and instant transition behavior.
- Shards owns `data-popup-open`, `data-trigger-disabled`, `data-open`, `data-closed`, `data-starting-style`, `data-ending-style`, `data-instant`, `data-side`, `data-align`, and viewport current/previous wrappers.

COSS does not include an explicit reduced-motion variant. Tests preserve and document that exact class contract while verifying that instant provider and focus phases suppress the transition through the upstream `data-instant` selector.

## Svelte and Shards mapping

`Tooltip.Provider`, `.Root`, `.Trigger`, and `.Popup` wrap the corresponding Shards parts. `.Popup` performs the same structural expansion as COSS. Portal props, placement, anchors, and popup props retain their proper ownership. `TooltipCreateHandle()` returns the same handle type exposed idiomatically as `new Tooltip.Handle()`.

The root adds `defaultOpen` only as a read-once initial state. `open` and `triggerId` remain bindable. Provider delay, close delay, and timeout pass through. Trigger `as`, ref, native attributes, disabled state, delays, close-on-click, payload, and state snippets pass through without a second interactive node. Button styling is applied to the Shards trigger element with `buttonVariants()`.

The COSS formatting particles compose Base UI triggers with toggle-group items through React's `render` prop. Shards deliberately makes the tooltip trigger own its element and does not expose an equivalent render-prop or attachment surface. The Svelte particles therefore render the one Shards trigger element inside the toggle-group container and apply the exact COSS toggle classes and pressed state to that same element. This preserves the visible DOM, tooltip focus/hover contract, and avoids nested buttons; it does not invent a second wrapper node.

## Gates

- SSR of the populated provider/root shell and real hydration from the exact generated marker tree, followed by hover opening and accessible-description verification without diagnostics.
- Hover rest, focus, blur, Escape, click cancellation, touch non-hover behavior, provider instant handoff, interactive and non-interactive boundaries, disabled state, custom portals/anchors, placement variables, detached payloads, and controlled state.
- Accessible description relationships, exact classes and slots, viewport morphing state, and reduced-motion/instant-state behavior.

Manual visual comparison is pending because the Codex in-app Browser was unavailable. No implementation or styling deviation is accepted.

## D7 documentation lane

- Re-read the complete permitted page, particles `p-tooltip-1` through `p-tooltip-4`, every permitted dependency, and the complete local Shards Tooltip source, docs, tests, demos, fixtures, provider timing, detached handles, IDs, positioning, focus, hoverability, and cleanup.
- Preserved hover/focus opening, accessible descriptions on the actual controls, grouped instant timing, animated payload transitions, exact formatting/share copy, right-side placement, and non-nested interactive markup through a typed `display: contents` trigger adapter. The page displays `p-tooltip-1`, `p-tooltip-2`, and `p-tooltip-3`; `p-tooltip-4` remains an assigned registry example.
- Hugeicons replace all seven upstream Lucide icons with two-pixel strokes. D7 tests cover inventory, SSR, compilation, focus, grouped hover, and detached hover transitions.
- The Codex in-app Browser runtime was unavailable in this worktree. Chrome was not used; headless production-browser coverage passed, and independent parity review must repeat manual inspection after integration.
