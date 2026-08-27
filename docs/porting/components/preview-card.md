# Preview card porting evidence

## Source record

- COSS revision: `19620ae8cae81e30775f2cde03829326cb4916b2`.
- Shards revision: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`.
- COSS component and page: `reference/apps/ui/registry/default/ui/preview-card.tsx` and `reference/apps/ui/content/docs/components/preview-card.mdx`.
- Importing particle read in full: `reference/apps/ui/registry/default/particles/p-preview-card-1.tsx`.
- Shards source: every file under `shardsui/packages/shardsui/src/lib/components/preview-card/`.
- Shards docs and demos: `shardsui/docs/src/content/preview-card.md` and every demo under `shardsui/docs/src/lib/components/content/demos/preview-card/`.
- Shards behavior evidence: every test and fixture under `shardsui/packages/shardsui/tests/preview-card/`, including hover/focus timing, multiline anchors, safe boundaries, detached handles, controlled state, portals, collision, and viewport transitions.

Context7 was attempted and returned `Monthly quota reached`. Manual inspection at `http://localhost:4000/docs/components/preview-card` was attempted only with the Codex in-app Browser; no in-app browser instance was available. Chrome was not used.

## Upstream contract

COSS exports `PreviewCard`, `PreviewCardTrigger`, `PreviewCardPopup`, `PreviewCardPrimitive`, and the compatibility aliases `HoverCard`, `HoverCardTrigger`, and `HoverCardContent`. `PreviewCardPopup` owns its portal and positioner. Defaults are centered alignment and a four-pixel side offset.

The sole COSS particle renders a ghost-button trigger labeled `coss.com/ui` and a 256-pixel popup with exact repository copy, language marker, star count, fork count, and Lucide icons. The primitive opens after hover rest or focus, remains open while the pointer crosses into interactive content, closes on Escape or outside press, and supports multiline inline trigger anchoring.

## Classes and semantics

The positioner class is exactly `z-50`. The popup preserves the complete COSS `relative flex w-64 ...` string: transform origin, balanced text, large radius, border, popover tokens, 16-pixel padding, small text, subtle shadow, pseudo-element highlights, and starting/ending scale and opacity states. COSS provides no explicit reduced-motion class, so the port preserves the upstream state-driven transition contract.

Preview card content is supplemental for sighted users. Shards does not add dialog semantics or an accessible description relationship to the trigger. Focus opening and dismissal remain supported without making the popup part of the trigger's accessible name.

## Svelte and Shards mapping

`PreviewCard.Root`, `.Trigger`, and `.Popup` wrap the matching Shards parts. `.Popup` expands to `Portal → Positioner → Popup`; `portalProps` go to the portal, `align`, `sideOffset`, and `anchor` go to the positioner, and remaining native props go to the popup. `HoverCard`, `HoverCardTrigger`, and `HoverCardContent` remain compatibility exports. `PreviewCardCreateHandle()` complements the idiomatic `new PreviewCard.Handle()` namespace API.

The trigger remains one Shards-owned element. `as`, ref, native attributes, delays, payload, and its state snippet are forwarded. `defaultOpen` is an initial-value translation; `open`, `triggerId`, and callbacks remain bindable Shards contracts.

## Gates

- SSR of the populated root shell and real hydration from the exact generated marker tree, followed by hover opening with no diagnostics.
- Hover rest delay, focus opening, safe pointer crossing, interactive content, Escape/outside dismissal, touch non-hover behavior, custom portal container, custom anchor, collision data/CSS variables, detached payloads, and controlled state.
- Exact particle copy, 256-pixel class geometry, slot attributes, and transition-state classes.

Manual visual comparison is pending because the Codex in-app Browser was unavailable. No product deviation is accepted.
