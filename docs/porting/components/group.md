# Group port evidence

## source record

- COSS component and documentation: `reference/apps/ui/registry/default/ui/group.tsx` and `reference/apps/ui/content/docs/components/group.mdx`
- Group particles read in full: `p-group-1.tsx` through `p-group-20.tsx`, plus `p-group-22.tsx` and `p-group-23.tsx`. There is no importing `p-group-21.tsx`.
- Other importers read in full: `p-switch-8`, `p-switch-9`, `p-input-7`, `p-popover-4`, `p-button-27`, `p-button-40`, and `p-tooltip-4`, all `.tsx`
- Shards has no Group component. Its Button, Input, Separator, Select, and Number Field sources and composition examples were checked where the COSS particles use them.
- Commits: COSS `19620ae8cae81e30775f2cde03829326cb4916b2`; Shards `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`

## contract and mapping

Group is a native composition wrapper. The port copies the complete COSS horizontal and vertical selector sets, including joined borders, corner rules, separator focus treatment, coarse-pointer adjustments, and dark hover and pressed rules. The default layout uses horizontal classes but omits `data-orientation`, matching the React output. An explicit orientation writes the attribute.

`Group.Text` keeps `as` for native tags and adds a typed `delegate` snippet for component composition. The delegate receives the merged COSS attributes, children, classes, slot, and a ref attachment. Particles 7, 8, and 17 pass those props to the local COSS Label. Label then applies its own `font-medium` class before Tailwind merges the Group Text typography and muted color, and it preserves `for` and ARIA props on the single Label root. `Group.Separator` wraps the local Separator and defaults to vertical. ButtonGroup aliases match the React exports.

SSR, type, hydration, and browser tests cover both orientations, native tags, delegated Label composition, separator orientation, exact slots and classes, label activation, native attributes, refs, and aliases.

## parity fixture inventory

`apps/ui/src/lib/parity/components/group.svelte` reproduces all seven dependency-free Group particles in source order: `p-group-7` through `p-group-10`, `p-group-16`, `p-group-17`, and `p-group-20`. Each has exact `id` and `data-particle` selectors. None has a registry width override. The fixtures preserve nested Group structure, separator orientation, Label delegation, button and input order, accessible labels, visible copy, and the official Lucide SVG geometry used by the React source.

Fifteen Group particles remain dependency-gated after fresh import inspection. `p-group-1`, `p-group-3` through `p-group-6`, and `p-group-13` require Menu. `p-group-2` requires Tooltip and the copy-to-clipboard hook. `p-group-11` requires Popover; `p-group-12` requires Tooltip; `p-group-14` requires NumberField and Select; `p-group-15`, `p-group-18`, and `p-group-19` require Select; `p-group-22` requires NumberField; and `p-group-23` requires Combobox. `p-group-21` does not exist in the pinned source.
