# Input Group port evidence

## source record

- COSS component and documentation: `reference/apps/ui/registry/default/ui/input-group.tsx` and `reference/apps/ui/content/docs/components/input-group.mdx`
- Input Group particles read in full: `p-input-group-1.tsx` through `p-input-group-24.tsx`, and `p-input-group-26.tsx` through `p-input-group-29.tsx`. There is no importing `p-input-group-25.tsx`.
- Other importers read in full: `p-slider-22`, `p-input-8` through `p-input-12`, `p-input-16`, `p-calendar-17`, `p-calendar-18`, `p-date-picker-5`, `p-group-12`, and `p-field-6`, all `.tsx`
- Shards has no Input Group component. The installed Shards Field Control behavior, local COSS Input and Textarea wrappers, and their complete source and tests were inspected before composition.
- Commits: COSS `19620ae8cae81e30775f2cde03829326cb4916b2`; Shards `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`

## contract and mapping

The root and four addon alignment variants copy the COSS class strings without shortening selectors. Input and Textarea reuse the local wrappers with `unstyled`, so Shards Field registration, generated IDs, bindings, refs, and validation still work. `InputGroup.Text` deliberately has no `data-slot`, matching COSS.

The addon mousedown contract also matches the React component. A non-interactive target prevents text selection and focuses the first input or textarea unless one already has focus. Buttons, links, controls, composite roles, and select triggers keep their own interaction. A consumer-supplied `onmousedown` replaces that default handler because the React prop spread appears after its internal handler.

The local COSS page was inspected in the in-app Browser. It rendered 17 documented groups. Addons followed inputs in DOM order while CSS logical ordering placed inline-start addons first. Clicking the first text addon focused its native input. The inspected Text spans had no slot attribute.

SSR, type, hydration, and headless browser tests cover all alignment classes, input and textarea composition, bindings, refs, logical ordering, addon focus handoff, interactive descendants, handler replacement, invalid selectors, and aliases.

## parity fixture inventory

`apps/ui/src/lib/parity/components/input-group.svelte` reproduces all 17 dependency-free InputGroup particles: `p-input-group-1` through `p-input-group-5`, `p-input-group-9` through `p-input-group-11`, `p-input-group-13` through `p-input-group-16`, `p-input-group-19`, `p-input-group-20`, `p-input-group-22`, `p-input-group-24`, and `p-input-group-26`. Every particle has exact `id` and `data-particle` review selectors. The registry preview constraint is full-width and `max-w-64` except for `p-input-group-19`, which uses `max-w-80`. The fixtures preserve source DOM order, copy, accessible labels, sizes, disabled and loading states, addon alignment, clear behavior, format toggles, the live character counter, password visibility, strength meter and requirement states, and the official Lucide SVG geometry.

Fresh source inspection corrects the earlier review classification for `p-input-group-24`: it imports only InputGroup and uses local value state, so it is dependency-free and included. Eleven particles are gated by unfinished wrappers or support code: `p-input-group-6` requires NumberField; `p-input-group-7` and `p-input-group-12` require Popover; `p-input-group-8` requires Tooltip and the copy-to-clipboard hook; `p-input-group-17` requires Menu and Tooltip; `p-input-group-18` requires Menu; `p-input-group-21`, `p-input-group-23`, `p-input-group-28`, and `p-input-group-29` require Tooltip; and `p-input-group-27` requires Select and Tooltip. `p-input-group-25` does not exist in the pinned source. No raw Shards or fixture-local substitutes are used for gated particles.
