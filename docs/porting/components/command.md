# Command port evidence

## COSS files inspected

- `reference/apps/ui/registry/default/ui/command.tsx`
- `reference/apps/ui/content/docs/components/command.mdx`
- `reference/apps/ui/registry/default/particles/p-command-1.tsx`
- `reference/apps/ui/registry/default/particles/p-command-2.tsx`

The complete wrapper, documentation page, and both direct command particles were read from the MIT-designated `reference/apps/ui/**` subtree. All indirect command importers were inventoried and inspected. No source from `reference/packages/ui/**` was used.

The two particles cover dialog command palettes, grouped apps and actions, filtering, shortcuts, keyboard invocation, empty results, selection, footers, and an asynchronous AI mode with loading and reference-link states.

## Shards files inspected

Shards has no separate Command primitive. The complete local Autocomplete and Dialog implementations, exported types, documentation, demos, tests, and fixtures were inspected because those primitives jointly provide the behavior. The local ScrollArea implementation was also inspected for the command list composition.

Context7 returned `Monthly quota reached`; the implementation follows the pinned local Svelte Edge references and the inspected local primitives. Chrome was not used.

## Translation decisions

- `Command.Root` is an always-open inline Shards Autocomplete with `autoHighlight="always"` and `keepHighlight`, matching the COSS command surface.
- Command input, panel, list, empty, group, label, item, separator, shortcut, and footer preserve the exact COSS slots and class strings. The shared Autocomplete input and list retain the original input and ScrollArea behavior.
- `Command.DialogRoot`, `DialogTrigger`, `DialogBackdrop`, `DialogViewport`, and `DialogPopup` compose Shards Dialog. The popup retains the exact COSS nested-dialog CSS variables, frame, motion, backdrop, and viewport geometry.
- The command handle is the Shards Dialog handle, so detached triggers and payload-driven dialogs remain available without shared module state.
- Item selection callbacks stay normal Svelte callback props. Consumers decide whether selection closes a dialog or navigates to a nested command page.

## Verification targets

- grouped filtering, empty results, exact item selection, active descendant, Arrow keys, Enter, Escape, and disabled commands
- standalone and dialog composition, initial input focus, trigger focus restoration, detached handles, portals, and nested dialogs
- keyboard invocation, search-to-AI transitions, loading feedback, async response replacement, and return-to-search behavior
- exact panel, input, item, separator, shortcut, footer, backdrop, viewport, popup classes, motion states, themes, and responsive height limits

## Browser evidence

The Codex in-app Browser rendered both particle sections. Opening the first palette focused the search input and exposed the Suggestions and Commands groups with the exact navigation footer. In the AI particle, entering `create a project` and pressing Tab showed seven skeletons plus `Generating response…`; after the upstream 1.5-second delay, the response and all three reference links replaced the loading state. No external Chrome window was used.
