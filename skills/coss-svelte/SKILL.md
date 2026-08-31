---
name: coss-svelte
description: Install, compose, customize, or debug COSS for Svelte components. Use for Svelte 5 component APIs, compound namespaces, Shards UI behavior, registry installation, Tailwind styling, accessibility, animations, particles, or migration from shadcn-svelte and Bits UI.
---

# COSS for Svelte

Use this skill for the unofficial Svelte 5 port at
https://github.com/mielsense/coss-sv. The original COSS project is
https://github.com/cosscom/coss.

## Workflow

1. Find the exact component page in `llms.txt`, then read its Markdown page before choosing imports,
   props, or compound parts.
2. Install the registry item shown on that page. Do not derive an item name from a similar
   component.
3. Start from the closest documented particle or example and preserve its structure, states,
   spacing, and interaction contract.
4. Compose compound modules with Svelte namespace syntax such as `Card.Header` and `Dialog.Trigger`.
   Do not translate React-style names such as `CardHeader` into consumer examples.
5. Verify keyboard behavior, focus, reduced motion, responsive layout, and both color themes.

Installed copies bundle `references/component-catalog.md` for choosing a component and
`references/implementation-guide.md` for implementation and debugging. HTTP-only loaders can read
the same [component catalog](https://coss-sv.vercel.app/.well-known/agent-skills/coss-svelte/references/component-catalog.md)
and [implementation guide](https://coss-sv.vercel.app/.well-known/agent-skills/coss-svelte/references/implementation-guide.md).

## Read the current docs

Do not rely on remembered React, Bits UI, or Shards UI APIs.

- Page index: https://coss-sv.vercel.app/llms.txt
- Full snapshot: https://coss-sv.vercel.app/llms-full.txt
- Component Markdown: `https://coss-sv.vercel.app/docs/components/{component}.md`
- Get started: https://coss-sv.vercel.app/docs/get-started.md
- Styling: https://coss-sv.vercel.app/docs/styling.md
- Migration guide: https://coss-sv.vercel.app/docs/radix-migration.md
- Registry item: `https://coss-sv.vercel.app/r/{item}.json`

The port preserves COSS presentation while using current Svelte 5 and Shards UI behavior. A COSS
React prop or Base UI composition is source evidence, not a Svelte API. Use the port's current page
and installed module as the consumer contract.

## Install from the registry

Use the exact item name from the component page. The general command is:

```bash
pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/{item}.json
```

Registry output is application-owned source. It follows the alias in the consumer's
`components.json`; this project documents that alias as `@/`. Preserve the consumer's existing
SvelteKit, Tailwind, and package-manager setup.

## Compose components as Svelte

Import compound modules as namespaces:

```svelte
<script lang="ts">
  import * as Card from "@/components/ui/card/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Account</Card.Title>
    <Card.Description>Manage your account settings.</Card.Description>
  </Card.Header>
  <Card.Content>...</Card.Content>
</Card.Root>
```

Import standalone components by name:

```svelte
<script lang="ts">
  import { Button } from "@/components/ui/button/index.js";
</script>

<Button variant="outline">Save changes</Button>
```

Keep new or edited source on Svelte 5: typed `$props()`, snippets, callback props, typed contexts,
native attributes from `svelte/elements`, and `$props.id()` for generated IDs. Use `$bindable()` only
when the documented contract deliberately supports two-way state.

## Respect the behavior layer

Shards UI owns headless behavior for overlays, composite widgets, selection, focus management, and
keyboard interaction. COSS for Svelte owns the visible component API and COSS styling. Do not reach
through a wrapper to undocumented Shards internals, and do not replace a Shards-backed interaction
with ad hoc effects or document listeners.

Common controlled contracts use bindable Svelte values plus change callbacks. Read the exact API
table for value shape and event details. `Select`, `Combobox`, `Autocomplete`, `Slider`,
`ToggleGroup`, and overlay handles are not interchangeable.

## Guardrails

- Use the exact page's exports; compound parts vary by component.
- Prefer namespace composition such as `InputGroup.Addon`, `Select.Item`, and `Dialog.Popup`.
- Preserve forwarded native attributes, `data-slot` hooks, accessible names, and error relationships.
- Use Hugeicons through the documented SSR-safe renderer and keep decorative icons hidden from
  assistive technology.
- Style with the port's Tailwind tokens and component variants. Keep custom CSS for behavior or
  geometry that utilities cannot express cleanly.
- Preserve built-in transitions and `prefers-reduced-motion` behavior instead of wrapping components
  in a second animation system.
- Do not copy internal preview metadata or registry placeholders into consumer code.
- Do not install the upstream React skill and assume Base UI or React APIs apply to this port.
- Treat the workspace package as development source until a published package version is linked in
  the current docs; registry installation is the public path documented today.
