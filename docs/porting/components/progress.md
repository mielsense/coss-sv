# Progress port evidence

## COSS files inspected

- Implementation: `reference/apps/ui/registry/default/ui/progress.tsx`
- Documentation: `reference/apps/ui/content/docs/components/progress.mdx`
- Every direct importer: `p-progress-1.tsx`, `p-progress-2.tsx`, and `p-progress-3.tsx`

The exact-module scan required `@/registry/default/ui/progress`. The root, Label, Track, Indicator, and Value retain every COSS class and `data-slot`. An omitted children snippet produces Track and Indicator. Explicit children replace the default.

## Shards files inspected

Every file under `shardsui/packages/shardsui/src/lib/components/progress/` and `shardsui/packages/shardsui/tests/progress/` was read, plus `shardsui/docs/src/content/progress.md` and the progress hero demo. The installed beta.0 runtime and types under `packages/ui/node_modules/@shardsui/svelte/dist/components/progress/` match the local behavior.

Shards supplies clamping, determinate, complete, and indeterminate state attributes, label IDs, `role="progressbar"`, formatted values, the hidden NVDA presentation span, refs, and state snippet arguments. The indicator uses inline percentage width for determinate values and no width for indeterminate values. COSS and Shards expose no progress CSS custom property. The local barrel re-exports Shards' `ProgressStatus` type.

## Rendered reference check

At value 20, the first React docs preview measured 256px by 6px for the track and about 51.2px by 6px for the indicator. Root, Track, and Indicator carried `data-progressing`; the indicator transition was `all 500ms`.

The exact `p-progress-1` source does not supply an accessible name. The port preserves that exception instead of adding an unrecorded `aria-label`. Accessibility assertions run against the separate labelled review probe. Component tests still cover the label relationship, and this record keeps the unnamed reference exception visible.

The live parity fixture retains the reference interval and random increment expression. Its Playwright check reads the root status, `aria-valuenow`, track rectangle, and indicator style in one page evaluation. A value from 20 through 99 must be progressing. A value of 100 must be complete. The indicator width must match the value from that same snapshot.

Tests also cover clamped complete, indeterminate, announcements, dynamic updates, refs, SSR, types, and hydration. The Codex in-app Browser was unavailable during implementation, so manual theme and viewport comparison remains pending independent in-app review.
