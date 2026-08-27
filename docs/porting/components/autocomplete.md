# Autocomplete port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/autocomplete.tsx`
- `reference/apps/ui/content/docs/components/autocomplete.mdx`
- `reference/apps/ui/registry/default/particles/p-autocomplete-1.tsx` through `p-autocomplete-16.tsx`

The registry wrapper, documentation page, and all sixteen direct particles were read in full from the MIT-designated `reference/apps/ui/**` subtree. The importer inventory was also checked for indirect autocomplete compositions. No source from `reference/packages/ui/**` was used.

The particles cover input sizes, disabled and invalid states, trigger and clear controls, leading add-ons, groups, object identity, custom filtering, async results, loading and empty status, controlled text, inline completion, and grid navigation.

## Shards files inspected

The complete implementation and exported types under `shardsui/packages/shardsui/src/lib/components/autocomplete/`, the Autocomplete documentation and demos, and every Autocomplete test and fixture were inspected. Shards owns collection identity, filtering, active-descendant focus, keyboard navigation, inline completion, form integration, portal placement, and async collection updates.

Context7 was requested for current framework documentation but returned `Monthly quota reached`. The port therefore uses the pinned local Svelte Edge references and the complete local Shards implementation. Chrome was not used.

## Translation decisions

- `Autocomplete.Root` and the primitive collection and value parts remain Shards components. The styled parts add the exact COSS slots, classes, defaults, and long-form aliases.
- `Autocomplete.Input` recreates the COSS input-control composition so sizes, leading add-ons, clear and trigger buttons, disabled opacity, invalid rings, and native `size` forwarding remain distinct contracts.
- Popup props are split across Shards Portal, Positioner, and Popup. Consumer classes style the same outer popup frame as COSS, while the inner primitive retains the available-height limit.
- The list uses the shared COSS ScrollArea wrapper with overscroll containment, scrollbar gutter, and scroll fade. Group, label, row, status, empty, separator, item, clear, and trigger parts preserve the observed `data-slot` values.
- Values remain the exact objects supplied by the consumer; no string round trip is used for selection identity. Shards filtering and `itemToStringValue` remain available.
- Clear controls default to the accessible name `Clear`; callers may override it.

## Verification targets

- typed input, local and custom filtering, object identity, empty and loading status, and async result replacement
- Arrow keys, Enter, Escape, active descendant, inline completion, disabled items, and focus retention
- hidden form values, controlled and bindable text, clear and trigger buttons, groups, rows, portals, and collision placement
- exact sizes, slots, class strings, popover geometry, scroll behavior, dark theme, and responsive text sizing

## Browser evidence

The Codex in-app Browser rendered the lane fixture beside the freshly inspected COSS examples. The default, small, and large input groups measured `256×32`, `256×28`, and `256×36` pixels, matching COSS. Typing `ora` exposed only Orange; Arrow Down established `aria-activedescendant` and the highlighted option. All sixteen particle sections rendered. No external Chrome window was used.
