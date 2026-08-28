# Date Picker port evidence

## Sources inspected

- COSS component and page: `reference/apps/ui/registry/default/ui/calendar.tsx` and `reference/apps/ui/content/docs/components/date-picker.mdx`
- COSS particles: every file from `p-date-picker-1.tsx` through `p-date-picker-9.tsx`
- Direct permitted consumers under `reference/apps/ui/**`
- Complete local Shards Popover, Field, Select, Combobox, and Input source directories, exported types, documentation, examples, fixtures, and tests

No source under `reference/packages/ui/**` was used.

## Port contract

Date Picker remains a composition of Calendar with Shards Popover, not a new package primitive. The nine Svelte particles preserve the single, range, dropdown, preset, input, close-on-select, multiple-date, Select-style, and two-month range examples. They use hydration-stable IDs, callback props, `$state`, bindings, typed snippets, native date inputs, fixed local-noon 2026 dates, and Hugeicons. The close-on-select example explicitly returns Popover state to false after Calendar selection, allowing Shards to restore trigger focus.

The page preserves the six upstream preview IDs and order, visible copy, and section sequence while translating React code and the shadcn command to Svelte. Focused tests source-audit, compile, and server-render all nine particles and compile the MDsveX page. The Codex in-app Browser was unavailable in this subagent session; no Chrome substitute was used, so the reviewer must repeat the visual, focus, keyboard, responsive, and motion comparison.

The five particles that display one selected date import `formatDatePpp` from
`apps/ui/registry/default/lib/date-format.ts`. The framework-neutral helper reproduces date-fns'
default en-US `PPP` output, including the 11th through 13th exception and `st`, `nd`, `rd`, and `th`
suffixes. Unit coverage includes 1, 2, 3, 11, 12, 13, 21, and 28 August. Production interaction
coverage selects 28 August 2026 and requires `August 28th, 2026` from particles 1, 3, 6, and 8;
particle 4 renders the same frozen selection at startup.

Particle 8 uses one native button as the Popover trigger. It composes the package's exported Select
trigger and icon classes directly, with no nested Select button, second button role, or extra tab
stop. The coordinator-owned registry entries for particles 1, 3, 4, 6, and 8 must request only
`local:date-format` for this helper.
