# Implementation guide

## Find the closest documented composition

Start with the exact component Markdown page. It contains the install command, particles, API tables,
accessibility notes, and source examples rendered from the same content as the site. Use a particle
that already demonstrates the requested state or layout before combining unrelated examples.

When repository access is available, component source lives under `packages/ui/src/components/ui/`
and the registry copy under `apps/ui/registry/default/components/ui/`. Consumer code must still use
the public paths and API shown in the docs.

## Install and import

Install the named registry item:

```bash
pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/card.json
```

The standard documented alias is `@/`. Import the installed source directly:

```svelte
<script lang="ts">
  import * as Card from "@/components/ui/card/index.js";
  import { Button } from "@/components/ui/button/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Profile</Card.Title>
    <Card.Description>Update your public details.</Card.Description>
  </Card.Header>
  <Card.Content>...</Card.Content>
  <Card.Footer>
    <Button>Save</Button>
  </Card.Footer>
</Card.Root>
```

If a project uses another alias, keep the alias configured in its `components.json`; registry
placeholders are resolved at installation time.

## State and events

Read the exact component's API table before binding state. Svelte values and callback props replace
React setters, but their shapes come from the Shards-backed component contract.

- Bind only documented controlled values, such as `bind:open`, `bind:value`, or `bind:pressed`.
- Keep callback detail types when the page exposes a reason or previous value.
- Treat `undefined`, `null`, an empty string, and an empty array as distinct unless the docs say
  otherwise.
- Use the component's handle or manager API for imperative overlays and toast flows. Do not emulate
  them with global mutable state.
- Put per-user mutable state inside the component or a typed context, never in shared server module
  scope.

## Styling and layout

Preserve semantic tokens, variants, sizes, `data-slot` attributes, and state selectors installed by
the registry. Prefer Tailwind utilities for ordinary layout, spacing, color, and responsive behavior.
Keep component CSS only where selectors, keyframes, browser quirks, or precise geometry make it the
clearer implementation.

Use `cn()` for class merging. Add consumer classes through the documented `class` prop rather than
editing internal selectors first. Verify narrow and wide containers; these components are designed to
compose inside application layouts, not only full-width documentation previews.

## Accessibility and motion

- Give icon-only controls an accessible label and hide decorative icons with `aria-hidden="true"`.
- Preserve native labels, descriptions, errors, required state, and disabled state.
- Exercise keyboard navigation, focus entry, focus return, Escape behavior, and outside interaction
  for overlays.
- Preserve listbox, menu, tab, radio, and slider keyboard conventions supplied by Shards UI.
- Test reduced motion. Do not add transitions around a primitive that already manages enter, exit,
  swipe, or collapse motion.
- Check light and dark themes plus forced or increased contrast where the surrounding application
  supports them.

## Debugging order

1. Confirm the registry item and local import path match the exact documentation page.
2. Confirm every compound part comes from the same namespace and is nested as the example shows.
3. Confirm bound state, value shape, item data, and callback props match the API table.
4. Check the browser console and rendered accessibility tree before changing component internals.
5. Compare the failing state with the closest documented particle in both themes and at the real
   container width.
6. Exercise keyboard input, focus return, pointer interaction, reduced motion, and validation state.
7. When editing the library itself, compare the permitted COSS reference source with the complete
   matching Shards UI source, tests, examples, and exported types before changing behavior.

## Source boundaries for contributors

The original COSS visuals and documentation are adapted only from the MIT-designated
`reference/apps/ui/**` subtree pinned by this repository. Do not copy from another upstream path
without recording and resolving its license. `reference/` and `shardsui/` are read-only evidence;
changes belong in the port's package, registry, docs, tests, or evidence records.
