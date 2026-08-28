# Table port evidence

## Source checked

- COSS revision: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/table.tsx`
- Documentation: `reference/apps/ui/content/docs/components/table.mdx`
- Particles: `p-table-1` through `p-table-8`
- Upstream tests: none in the MIT `reference/apps/ui/**` subtree

All adapted source is inside `reference/apps/ui/**`.

## Upstream contract

`Table` renders a `div` scroll container around a native `table`. The container is `relative w-full overflow-x-auto`, carries `data-slot="table-container"`, and publishes the selected variant through `data-variant`. Table attributes belong to the table, not the scroll container.

The default variant uses collapsed row borders. The `card` variant switches to separate borders with zero spacing. Descendant selectors then give body cells their background, border edges, rounded outer corners, hover color, selected color, and light or dark shadows. The port copies the complete class strings from the registry source without shortening the selector set.

The remaining parts map directly to native elements.

| Part           | Element   | Key contract                                                                                        |
| -------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `TableHeader`  | `thead`   | Adds a bottom border to its rows.                                                                   |
| `TableBody`    | `tbody`   | Owns card borders, corners, cell surfaces, hover and selected colors, and the last-row border rule. |
| `TableFooter`  | `tfoot`   | Uses the variant-aware background and footer row border rule.                                       |
| `TableRow`     | `tr`      | Publishes hover and selected-state colors.                                                          |
| `TableHead`    | `th`      | Uses 40 px height, nowrap text, muted foreground, and checkbox-aware widths.                        |
| `TableCell`    | `td`      | Uses 10 px padding, footer padding, card edge corrections, and checkbox-aware widths.               |
| `TableCaption` | `caption` | Stays inside the table and moves farther away in the card variant.                                  |

`p-table-1`, `p-table-2`, `p-table-5`, and `p-table-7` are static project tables in the default, Frame, bare card, and CardFrame layouts. `p-table-3` and `p-table-6` add TanStack row selection. `p-table-4` and `p-table-8` add sorting, paging, Select, and Pagination around a fixed flight table.

## Shards checked

Table is native in the approved strategy. The complete Shards ScrollArea source, documentation, demos, and tests were checked for overflow behavior. COSS does not use ScrollArea here. It uses a native `overflow-x-auto` container, and the port keeps that exact choice.

## Svelte mapping

- Namespace parts: `Root`, `Header`, `Body`, `Footer`, `Row`, `Head`, `Cell`, and `Caption`
- Compatibility names: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, and `TableCaption`
- Every part uses its native `svelte/elements` attribute type, a typed snippet, and a bindable typed ref.
- Table attributes and callbacks forward to the native `table`.
- `containerAs`, `containerClass`, `containerId`, `containerStyle`, and `containerRef` are the Svelte translation for customizing the React `render` container.
- The variant remains `default | card`, with `default` as the default.

No JavaScript manages row, sorting, selection, or pagination state. Those features belong to examples or consumer code, just as they do upstream.

## Tests

- Five server-rendering contract tests
- Two type contract tests
- Four Chromium component tests
- Coverage for every native part, caption relationships, column headers, rows, cell header references, footer spans, card classes, forwarded attributes, callbacks, refs, selected state, real horizontal overflow at a narrow width, and real hydration

The deterministic component parity fixture reproduces all four static examples with production wrappers: `p-table-1`, Frame-backed `p-table-2`, bare card-variant `p-table-5`, and CardFrame-backed `p-table-7`. Each preview wrapper follows the registry metadata with `w-full sm:max-w-4xl`. `p-table-3` and `p-table-6` remain gated by the chosen TanStack Svelte table adapter plus Checkbox. `p-table-4` and `p-table-8` remain gated by that adapter plus Select, Checkbox, Badge, Pagination, and Frame/CardFrame. These are example dependencies, not missing Table behavior. The parity reviewer still needs to compare the default and card variants in both themes and at desktop and mobile widths with the Codex in-app browser.

## Deviations

React's container `render` prop is replaced by typed native container props. Component state and styling have no deviation.

## D9 TanStack and documentation pass

The D9 lane re-read the complete permitted page and all eight particle sources. The four stateful examples use the official Svelte 5 adapter from `@tanstack/svelte-table@9.2.3`, with explicit row-selection, sizing, sorting, and pagination features rather than React or v8 compatibility APIs. The flight examples preserve the 30 upstream records, column widths, fixed table layout, status treatments, sortable time header, page ranges, and Frame/CardFrame surfaces. Lucide glyphs are replaced only by the corresponding Hugeicons arrows and takeoff icon.

Each of `p-table-3`, `p-table-4`, `p-table-6`, and `p-table-8` needs an item-level `@tanstack/svelte-table` registry dependency when the coordinator generates registry items. The package is centrally approved and licensed; it must not become an undeclared transitive assumption. Focused tests source-audit and server-render all eight particles and compile the page. The in-app Browser was unavailable in this subagent session; Chrome was not used, and manual visual and keyboard comparison remains pending.
