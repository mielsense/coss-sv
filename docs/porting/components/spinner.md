# Spinner port evidence

## COSS files inspected

- Implementation: `reference/apps/ui/registry/default/ui/spinner.tsx`
- Documentation: `reference/apps/ui/content/docs/components/spinner.mdx`
- Direct particle importers: `p-autocomplete-12.tsx`, `p-autocomplete-16.tsx`, `p-button-18.tsx`, `p-button-40.tsx`, `p-command-2.tsx`, `p-input-12.tsx`, `p-input-16.tsx`, `p-input-group-16.tsx`, `p-spinner-1.tsx`, and `p-toast-8.tsx`
- Direct production use: `reference/apps/ui/registry/default/ui/button.tsx`

All 11 direct uses were read in full. Generated registry JSON was treated as a mirror. COSS renders Lucide's LoaderCircle with `animate-spin`, default `aria-label="Loading"`, and `role="status"`, then spreads consumer props last.

Shards has no Spinner component. Per the component plan, its complete Progress source, docs, demo, and tests were inspected as the nearest status primitive. Spinner remains a semantic SVG because no Shards behavior is needed.

## Svelte and rendered contract

The Svelte component reproduces Lucide's exact SVG attributes, classes, and loader path. Its typed contract includes `size`, `strokeWidth`, `absoluteStrokeWidth`, and `children`. A default `size` of 24 sets both dimensions, while explicit `width` or `height` wins. Absolute stroke width uses Lucide's `strokeWidth * 24 / size` calculation. Consumer SVG children render after the loader path. The component keeps a bindable ref, forwards native callbacks and attributes, and adds no wrapper or module state.

The first React docs preview computed to a 24px SVG with `spin 1s linear infinite`, accessible name `Loading`, and status role. COSS has no reduced-motion class, so reduced motion retains that animation for parity. Tests cover default dimensions, explicit dimension overrides, absolute stroke width, appended children, exact SSR markup, callbacks, refs, status announcement, tab order, types, and hydration. The docs parity E2E fixture checks the computed animation in both motion modes. The Codex in-app Browser was unavailable during implementation, and no external browser was used.
