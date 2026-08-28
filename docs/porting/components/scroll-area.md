# Scroll area port evidence

## Source checked

- COSS revision: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/scroll-area.tsx`
- Documentation: `reference/apps/ui/content/docs/components/scroll-area.mdx`
- Dedicated particles: `p-scroll-area-1` through `p-scroll-area-5`
- Other particles: `p-calendar-19` and `p-command-2`
- Direct consumers checked: autocomplete, combobox, dialog, drawer, sheet, sidebar, the MDX table and code renderers, the command code block, and the docs table of contents
- Upstream tests: none in the MIT `reference/apps/ui/**` subtree

All source used for the port is inside the MIT-designated `reference/apps/ui/**` boundary.

## Upstream contract

`ScrollArea` wraps one root, viewport, content container, two scrollbar tracks, two thumbs, and a corner. The vertical track comes before the horizontal track. COSS exposes five options.

| Option                 | Default | Effect                                                                                           |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `scrollFade`           | `false` | Adds four masks driven by the Shards overflow distance variables and sets `--fade-size: 1.5rem`. |
| `scrollbarGutter`      | `false` | Adds `pe-2.5` for vertical overflow and `pb-2.5` for horizontal overflow.                        |
| `fill`                 | `false` | Adds `size-full` to the content part.                                                            |
| `clampContentMinWidth` | `true`  | Overrides Shards `min-width: fit-content` with `min-width: 0`.                                   |
| `overscrollContain`    | `false` | Applies axis-specific overscroll containment only when that axis overflows.                      |

The root classes are `size-full min-h-0`. The viewport uses `h-full rounded-[inherit] outline-none transition-shadows` plus the COSS focus ring. Each track uses `m-1`, a 300 ms delayed opacity transition, a 6 px cross-axis size, and the Shards `data-hovering` and `data-scrolling` states. The thumb is `relative flex-1 rounded-full bg-foreground/20`.

The five dedicated examples cover vertical content, horizontal content, both axes, the edge mask, and reserved scrollbar space. `p-calendar-19` combines the mask, gutter, and overscroll options. `p-command-2` uses the same combination for generated content.

## Shards checked

- Shards revision: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Complete source directory: `shardsui/packages/shardsui/src/lib/components/scroll-area/**`
- Documentation: `shardsui/docs/src/content/scroll-area.md`
- Demos: `hero`, `both`, and `scroll-fade`
- Tests and fixtures: every file under `shardsui/packages/shardsui/tests/scroll-area/**`
- Published compatibility target: `@shardsui/svelte@0.1.0-beta.0`

The published package has the same parts used by the inspected local revision. Shards owns measurement, overflow state, overflow distance variables, pointer drag, track press, wheel forwarding, right-to-left offsets, corner size, hover state, scroll state, resize observation, snap suspension, and the viewport tab index. The wrapper does not duplicate that code.

## Svelte mapping

- `ScrollArea` keeps the compact COSS component and composes `ScrollAreaPrimitive.Root`, `Viewport`, `Content`, `Scrollbar`, `Thumb`, and `Corner`.
- `ScrollBar` keeps the COSS compatibility name.
- `ScrollAreaPrimitive` exposes the complete Shards namespace.
- `Root`, `Viewport`, `Content`, `Scrollbar`, `Thumb`, and `Corner` are typed aliases for consumers who need raw composition.
- The root `ref`, native attributes, callback props, `as`, and `overflowEdgeThreshold` pass to Shards.
- Feature flags only change the same classes or inline minimum width used by COSS.

There is no shared mutable state in the wrapper. Shards creates state per root and measures only after mount, so server output stays deterministic.

## Tests

- Four server-rendering contract tests
- Two type contract tests
- Four Chromium component tests
- Real-layout coverage for vertical overflow, horizontal overflow, both scrollbars, corner size, no-overflow unmounting, keyboard scroll, native callbacks, refs, and hydration

The deterministic component parity fixture reproduces all five dedicated examples with production wrappers. It also applies the registry metadata for `p-scroll-area-1` and `p-scroll-area-4`: the preview wrapper is full width with the exact `max-w-64` (256 px) constraint. `p-calendar-19` is gated by Calendar; `p-command-2` is gated by Command. Those gates affect consumer examples, not ScrollArea. The parity reviewer still needs to compare the running COSS and Svelte examples in the Codex in-app browser.

## Deviations

None in component behavior or styling.

## D9 documentation and particle pass

The D9 lane re-read the complete COSS page and five particle sources plus the complete matching Shards implementation, documentation, examples, fixtures, tests, and types. The page preserves the upstream preview order `1, 4, 2, 5, 3`; the particles retain the Alice copy, horizontal and two-axis sizing, fade, gutter, and overscroll options. Focused source, SSR, and MDsveX tests cover all five. The in-app Browser was unavailable in this subagent session, so Chrome was not used and manual visual comparison remains pending.

The repair pass restored every permitted upstream documentation section: both installation paths,
the complete Alice usage sample, the root option table, each public part heading and description,
all five examples in source order, the fill and overscroll code samples, content minimum-width
guidance, and both dated changelog entries. Only React syntax, Base UI names, package commands, and
local documentation routes were translated to their Svelte and Shards equivalents.
