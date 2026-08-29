# Particles page

## COSS evidence

The port was checked against the complete permitted source for the COSS particles route:

- `reference/apps/ui/app/particles/page.tsx`
- `reference/apps/ui/app/particles/particles-display.tsx`
- `reference/apps/ui/app/particles/search-container.tsx`
- `reference/apps/ui/app/particles/search-field.tsx`
- `reference/apps/ui/app/particles/particle-card.tsx`
- `reference/apps/ui/app/particles/particle-card-container.tsx`
- `reference/apps/ui/registry/registry-categories.ts`
- `reference/apps/ui/registry/registry-particles.ts`

The checked-in catalog retains all 508 COSS particle names, descriptions, categories, category order, registry dependencies, card classes, and column spans. The page intersects that catalog with the Svelte preview registry, so unpublished particles do not appear as broken cards. The visible count reaches 508 when every approved Svelte particle is present.

## Preserved behavior

- The initial route opens the category combobox and renders no cards until a valid category is selected.
- `tags` is a comma-separated URL parameter. Navigation keeps the current scroll position and input focus.
- Invalid tags and valid combinations with no results show the exact COSS empty message.
- Categories that cannot produce a result with the current selection remain visible in the `No matches` group and are disabled.
- Results require every selected category and use COSS's 30/20/10 prefix, dependency, and primary-category relevance weights.
- Cards use the COSS two-column responsive grid, live Svelte particle preview, exact description, registry copy action, and right-side source drawer.
- Installation commands use `shadcn-svelte`, as required by this port.

## Verification

- `apps/ui/tests/particles/model.test.ts` covers the pinned catalog, URL parsing, category order, compatibility groups, filtering, and relevance sorting.
- `apps/ui/tests/site/particles.browser.mjs` covers the production route, URL updates, combined filters, exact result metadata, Hugeicons rendering, source drawer, Escape focus restoration, invalid filters, and mobile overflow.
- The Codex in-app Browser was used for desktop visual inspection and the same interaction paths. Chrome was not used.
