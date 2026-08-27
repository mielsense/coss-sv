# Kbd port evidence

## Sources inspected

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/kbd.tsx`
- Documentation: `reference/apps/ui/content/docs/components/kbd.mdx`
- Primary particle: `reference/apps/ui/registry/default/particles/p-kbd-1.tsx`
- Other direct consumers: `p-button-31.tsx`, `p-command-1.tsx`, `p-command-2.tsx`, `p-input-11.tsx`, `p-input-group-11.tsx`, and `reference/apps/ui/components/command-menu.tsx`
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Closest Shards source: `shardsui/packages/shardsui/src/lib/components/button/button.svelte` and `index.ts`
- Shards test, documentation, and examples: `shardsui/packages/shardsui/tests/button/button.test.ts`, `shardsui/docs/src/content/button.md`, and the button hero and loading demos

## COSS contract

`Kbd` and `KbdGroup` are semantic `kbd` elements. A key is a 20 pixel-high inline flex box with a 20 pixel minimum width, four-pixel horizontal padding and radius, 12 pixel muted text, a muted background, and a three-pixel default SVG size. A group is an unstyled inline-flex `kbd` with a four-pixel gap. The nested `kbd` markup is intentional and matches every COSS particle.

Consumer utilities merge last, so a conflicting consumer text or gap utility wins. Native attributes, callback props, snippets, and bindable refs are forwarded. Shards Button was inspected because Kbd appears inside several buttons, but Kbd is not interactive and must not acquire Button focus, disabled, or pressed state. No Shards wrapper is used.

## Browser evidence

Reference: `http://127.0.0.1:4000/ui/docs/components/kbd`

Svelte: `http://127.0.0.1:5102/preview/kbd?theme=<light|dark>&width=<mobile|desktop>`

The in-app Browser inspection confirmed the exact particle copy and key order: four standalone keys, then groups for Command-K, Command-Shift-P, and Control-Alt-Delete. The untouched particle root is `flex flex-col gap-4` and measures about 251.695 by 112 pixels, centered at both review widths. Review-only centering lives on a separate parent. Both implementations compute 20 pixel key height and minimum width, 12 pixel text, 16 pixel line height, four-pixel padding and group gap, and four-pixel key radius. The exact combination row is `flex gap-2` with normal no-wrap behavior; the fixture does not add responsive wrapping or a Kbd-specific reset. The shared docs reset lives in the base cascade layer, so the component utilities win without fixture overrides. The fixture separately asserts that group backgrounds, borders, and radii remain transparent and zero.

The exact upstream dark muted key color is `rgb(129, 129, 129)` on the muted key surface and fails axe `color-contrast`. The E2E test pins that color, disables only the upstream contrast rule in dark mode, and keeps all other axe checks enabled. Light mode runs the complete axe ruleset. Desktop/mobile, both themes, and browser consoles pass.

## Test coverage

- red-first SSR and type tests for both exports, semantic tags, exact classes, class conflict resolution, callbacks, snippets, attributes, and refs;
- browser callback/ref and hydration tests;
- exact primary particle fixture and Playwright checks for count, copy, no-wrap combination layout, geometry, theme colors, the transparent group contract, axe, and console errors.

Accepted deviations: none.
