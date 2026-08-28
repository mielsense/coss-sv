# Pagination port evidence

## Source checked

- COSS revision: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/pagination.tsx`
- Documentation: `reference/apps/ui/content/docs/components/pagination.mdx`
- Particles: `p-pagination-1`, `p-pagination-2`, and `p-pagination-3`
- Table consumers: `p-table-4` and `p-table-8`
- Upstream tests: none in the MIT `reference/apps/ui/**` subtree

All adapted source is inside `reference/apps/ui/**`.

## Upstream contract

The root is a `nav` with `aria-label="pagination"`, centered full-width layout, and a `data-slot`. Its content is a horizontal `ul`; every item is an `li`.

Page links reuse the COSS Button classes. Inactive links use the ghost variant and active links use outline. The default size is `icon`. An active link gets `aria-current="page"` and `data-active`. Previous and next links default to the regular button size, keep their labels for assistive technology, hide the visible words below the `sm` breakpoint, and use the matching Lucide chevron. Ellipsis is hidden from the accessibility tree and contains the screen-reader copy `More pages`.

`p-pagination-1` covers numbered links, one current page, ellipsis, and previous and next links. `p-pagination-2` renders two outline Buttons and swaps enabled buttons to links. `p-pagination-3` combines Button, Select, mutable current-page state, result ranges, and the previous and next wrappers. The two flight-table examples use the same previous and next composition.

## Shards checked

Pagination is native in the approved component strategy. There is no matching Shards component to wrap. The inspection covered the complete Shards Button source and its documentation, demo, and tests. It also covered `shardsui/packages/shardsui/src/lib/components/menu/**`, the Menu documentation, its demos, trigger/root tests, and multiple-trigger fixtures as required by the component plan. Those Menu sources establish the local convention of typed snippet payloads that carry state into caller-owned composition. Pagination uses that convention for delegated controls without importing Menu at runtime.

## Svelte mapping

- Namespace parts: `Root`, `Content`, `Item`, `Link`, `Previous`, `Next`, and `Ellipsis`
- Compatibility names: `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, and `PaginationEllipsis`
- `PaginationLink` uses the shared `buttonVariants` function, so link geometry and interaction classes stay aligned with Button.
- `as` remains available for native element polymorphism.
- React's `render` target becomes a typed `delegate` snippet. It receives a `ButtonProps` object containing the forwarded attributes, Pagination semantics, caller class, and the previous or next wrapper's owned content. The delegate chooses Button's `disabled`, callbacks, `size`, and `variant` props.
- The same snippet payload exposes a typed ref channel. Binding the delegated Button with `bind:ref={ref.current}` keeps `PaginationLink`'s public `bind:ref` contract: it resolves to the rendered Button element and resets to `null` when that element unmounts.
- The delegated path omits `PaginationLink`'s ghost/outline and size classes. This matches COSS, which skips `buttonVariants` whenever `render` is present.
- Link attributes, callback props, snippets, and refs forward to the rendered element.
- Previous and next intentionally own their icon and label snippets, as COSS does.

The package delegates its navigation and overflow glyphs to the centrally configured Hugeicons runtime.

## Tests

- Six server-rendering contract tests
- Two type contract tests
- Six Chromium component tests
- Coverage for landmark naming, list semantics, one current page, link attributes, native polymorphism, exact accessible copy, ellipsis hiding, callbacks, native and delegated refs, delegated Button classes and disabled behavior, delegated-ref teardown and remount, owned previous/next content, and real hydration

The deterministic component parity fixture includes exact `p-pagination-1` and `p-pagination-2` examples. The second example uses the upstream full-width preview metadata and preserves the Button contract: the boundary control is a disabled native button, while the enabled control renders as a link with the computed page hash. `p-pagination-3` is gated only by Select. `p-table-4` and `p-table-8` additionally require the chosen TanStack Svelte table adapter and their surrounding Select, Checkbox, Badge, Pagination, and Frame/CardFrame dependencies. Pagination itself is no longer a gate. The parity reviewer still needs to compare responsive label hiding and computed Button styles in the Codex in-app browser.

## Deviations

The React-only `render` element prop is translated to a typed Svelte `delegate` snippet. This is a framework-shaped API difference, not a behavior or styling deviation.

## Hugeicons authority update

Previous, next, and ellipsis now use `ChevronLeftIcon`, `ChevronRightIcon`, and `MoreHorizontalIcon` through `HugeiconsIcon`. Accessible copy stays on the owning link or screen-reader span; every glyph is decorative. Responsive label hiding, negative icon margins, ellipsis sizes, delegated Button behavior, and ref forwarding are unchanged.
