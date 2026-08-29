# Autocomplete port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/autocomplete.tsx`
- `reference/apps/ui/content/docs/components/autocomplete.mdx`
- `reference/apps/ui/registry/default/particles/p-autocomplete-1.tsx` through `p-autocomplete-16.tsx`

The registry wrapper, documentation page, and all sixteen direct particles were read in full from the MIT-designated `reference/apps/ui/**` subtree. The importer inventory was also checked for indirect autocomplete compositions. No source from `reference/packages/ui/**` was used.

The particles cover input sizes, disabled and invalid states, trigger and clear controls, leading add-ons, groups, object identity, custom filtering, async results, loading and empty status, controlled text, inline completion, and grid navigation.

## Shards files inspected

The complete implementation and exported types under `shardsui/packages/shardsui/src/lib/components/autocomplete/`, the Autocomplete documentation and demos, and every Autocomplete test and fixture were inspected. Shards owns collection identity, filtering, active-descendant focus, keyboard navigation, inline completion, form integration, portal placement, and async collection updates.

Current Svelte documentation was checked through Context7 alongside the pinned local Svelte Edge references. Chrome was not used.

## Translation decisions

- `Autocomplete.Root` and the primitive collection and value parts remain Shards components. The styled parts add the exact COSS slots, classes, defaults, and long-form aliases.
- `Autocomplete.Input` recreates the COSS input-control composition so sizes, leading add-ons, clear and trigger buttons, disabled opacity, invalid rings, and native `size` forwarding remain distinct contracts.
- Popup props are split across Shards Portal, Positioner, and Popup. Consumer classes style the same outer popup frame as COSS, while the inner primitive retains the available-height limit.
- The list uses the shared COSS ScrollArea wrapper with overscroll containment, scrollbar gutter, and scroll fade. Group, label, row, status, empty, separator, item, clear, and trigger parts preserve the observed `data-slot` values.
- Object items are passed to the collection unchanged. Autocomplete itself remains a text-value API: `itemToStringValue` supplies the selected text, matching both COSS and Shards.
- Clear controls default to the accessible name `Clear`; callers may override it.

## Verification targets

- typed input, local and custom filtering, object-item stringification, empty and loading status, and async result replacement
- Arrow keys, Enter, Escape, active descendant, inline completion, disabled items, and focus retention
- hidden form values, controlled and bindable text, clear and trigger buttons, groups, rows, portals, and collision placement
- exact sizes, slots, class strings, popover geometry, scroll behavior, dark theme, and responsive text sizing

## Browser evidence

The Codex in-app Browser rendered the lane fixture beside the freshly inspected COSS examples. The default, small, and large input groups measured `256×32`, `256×28`, and `256×36` pixels, matching COSS. Typing `ora` exposed only Orange; Arrow Down established `aria-activedescendant` and the highlighted option. All sixteen particle sections rendered. No external Chrome window was used.

## Repair verification

The repair reread the wrapper, documentation page, all sixteen particles, and the full local Shards Autocomplete source, tests, fixtures, documentation, and exported types before changing coverage. Browser tests now cover filtering, active-descendant navigation, form text, clearing, inline completion, empty results, the loading-to-result transition, and object-item stringification.

The icon-authority repair reread the COSS wrapper and every icon-bearing particle. Search, clear, trigger, and address-pin icons now use official free-core data through the shared SSR-safe `HugeiconsIcon` renderer. Source regression coverage rejects direct renderer imports, inline SVG, and Lucide markup. The separator uses a public prop contract derived from the complete Shards separator type. Package-output coverage checks its generated declaration and `ref` binding with the other delegated parts.

## D8 documentation and particle port

The documentation lane freshly reread the complete permitted COSS Autocomplete MDX page, all 16 Autocomplete particles, every particle consumer, and the complete local Shards Autocomplete implementation, documentation, demos, tests, fixtures, and exported types. The Svelte page preserves the source preview order `1–9, 14, 10–13`, headings, descriptions, installation flow, and examples while presenting the namespace API used by this port. All 16 production particle modules use the package Autocomplete implementation, Svelte 5 snippets and runes, and Hugeicons.

The source/SSR gate imports and renders all 16 modules. Browser coverage verifies filtering, Arrow/Enter selection, disabled and multiple states through consumers, and reduced motion. In the Codex in-app Browser, the COSS and Svelte default inputs both measured `254×30` pixels with a `10px` radius, `0 11px` padding, `14px` type, and `30px` line height. Chrome was not used. The page route is intentionally separate from the coordinator-owned documentation manifest; it becomes live after that aggregate enrolls `components/autocomplete`.

The D8 repair preserves the upstream `will_error` branch in `p-autocomplete-12`. Search starts after a 300 ms debounce, then waits for the permitted 100 to 600 ms simulated request. Query changes and component destruction cancel both stages and invalidate stale results. Controlled-time browser coverage checks each boundary and the exact `Failed to fetch movies. Please try again.` copy.

`p-autocomplete-16` reads `VITE_GOOGLE_MAPS_API_KEY` through `import.meta.env`, which works after registry installation in a Svelte and Vite project. It does not import a monorepo-only environment module. Configured clients send the COSS Places Autocomplete request with one short-lived session token. Selection resets that token. Query changes and destruction abort pending work. Without a key, the particle searches the exact COSS sample addresses after the same debounce and simulated delay. Browser coverage checks live-request parsing, token reuse and reset, abort cleanup, fallback results, and the exact error status.
