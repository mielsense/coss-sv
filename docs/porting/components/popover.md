# Popover porting evidence

## Source record

- COSS revision: `19620ae8cae81e30775f2cde03829326cb4916b2`.
- Shards revision: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`.
- COSS component: `reference/apps/ui/registry/default/ui/popover.tsx`.
- COSS page: `reference/apps/ui/content/docs/components/popover.mdx`.
- Direct examples: `p-popover-1.tsx` through `p-popover-4.tsx`.
- Other importing particles read in full: `p-date-picker-1.tsx` through `p-date-picker-9.tsx`, `p-group-11.tsx`, `p-input-8.tsx`, `p-input-10.tsx`, `p-input-group-7.tsx`, `p-input-group-12.tsx`, and `p-switch-7.tsx` through `p-switch-9.tsx`.
- Shards source: every file in `shardsui/packages/shardsui/src/lib/components/popover/`.
- Shards documentation and examples: `shardsui/docs/src/content/popover.md` and every demo under `shardsui/docs/src/lib/components/content/demos/popover/`.
- Shards behavior evidence: every test and fixture under `shardsui/packages/shardsui/tests/popover/`, including detached handles, hover opening, dismissal, focus, collision, custom anchors, portals, viewport morphing, and controlled state.

Context7 could not return current Svelte documentation because the workspace quota was exhausted. The implementation therefore uses the pinned Svelte Edge references and the complete local Shards source, declarations, documentation, demos, tests, and fixtures. Manual reference inspection at `http://localhost:4000/docs/components/popover` was attempted through the Codex in-app Browser. The in-app Browser reported no available browser instance; Chrome was not used.

## Upstream contract

COSS exports `Popover`, `PopoverTrigger`, `PopoverPopup`, `PopoverContent`, `PopoverClose`, `PopoverTitle`, `PopoverDescription`, `PopoverCreateHandle`, and `PopoverPrimitive`. `PopoverPopup` owns the portal, positioner, popup, and viewport. Defaults are `side="bottom"`, `align="center"`, `sideOffset={4}`, and `alignOffset={0}`. `tooltipStyle` changes the popup radius, shadow, width, text size, and viewport padding.

The direct examples cover feedback form content, two close buttons, detached triggers with typed payloads, and a controlled checkbox selection menu. Other particles require controlled open state, custom anchors through composition, `openOnHover`, custom alignment offsets, calendar content, nested tooltip triggers, and modal-free dismissal.

The popup is a `role="dialog"`. `Title` and `Description` register hydration-stable IDs that become `aria-labelledby` and `aria-describedby`. Escape, outside press, focus movement, and `Close` dismiss the popup. Focus returns according to the Shards focus contract. Hover opening uses a safe interactive boundary between trigger and popup. Touch activates the click path rather than hover.

## Class and state inventory

- Positioner: `z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] data-instant:transition-none`.
- Popup: the exact COSS `relative flex ...` class string, including `--popup-width`, `--popup-height`, `--transform-origin`, the popover border/background/shadow, calendar descendant variants, and starting scale/opacity states.
- Viewport: the exact COSS size, available-height, padding, overflow, current/previous width, opacity, and transition selectors.
- Tooltip style: `w-fit text-balance rounded-md text-xs shadow-md/5`, the smaller pseudo-element radius, and two-spacing inline padding with `py-1`.
- Data contract: `data-popup-open`, `data-pressed`, `data-open`, `data-closed`, `data-starting-style`, `data-ending-style`, `data-instant`, `data-side`, `data-align`, and viewport current/previous wrappers remain Shards-owned.

COSS has no `motion-reduce:*` class on this component. The port preserves that observable class contract; tests cover the state-driven transition attributes and exact class string rather than inventing a port-only reduced-motion variant.

## Svelte and Shards mapping

| COSS surface | Svelte surface | Shards parts |
| --- | --- | --- |
| `Popover` | `Popover.Root` / `Popover` | `Popover.Root` |
| `PopoverTrigger` | `Popover.Trigger` | `Popover.Trigger` |
| `PopoverPopup` / `PopoverContent` | `Popover.Popup` / `Popover.Content` | `Portal`, `Positioner`, `Popup`, `Viewport` |
| `PopoverClose` | `Popover.Close` | `Popover.Close` |
| `PopoverTitle` | `Popover.Title` | `Popover.Title` |
| `PopoverDescription` | `Popover.Description` | `Popover.Description` |
| `PopoverCreateHandle()` | `PopoverCreateHandle()` and `new Popover.Handle()` | `Popover.Handle` |

`children` are Svelte snippets. Bindable `open` and `triggerId` remain Shards contracts. `defaultOpen` is read once and translated to the initial bindable state. Popup `portalProps` are spread onto `Portal`; placement and anchor props go to `Positioner`; remaining props go to `Popup`. The trigger renders one Shards-owned element and supports `as`, refs, native attributes, and state snippets. Consumers style that element with `buttonVariants()` when Button appearance is required, avoiding nested interactive elements.

## Gates

- SSR rendering of the populated root shell and its hydration-stable trigger.
- Real SSR-to-hydration from the exact generated marker tree, followed by an open interaction that verifies the registered title and description without diagnostics.
- Pointer and keyboard opening, Escape, outside dismissal, close buttons, focus restoration, custom portal containers, custom anchors, placement variables, hover delay, interactive hover boundaries, touch behavior, detached payloads, and controlled/bindable state.
- Exact class and slot attributes, including tooltip style and transition states.

Manual visual inspection is pending because no Codex in-app Browser instance was available. No implementation or style deviation is accepted.
