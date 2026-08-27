# Toggle port evidence

## source record

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Component: `reference/apps/ui/registry/default/ui/toggle.tsx`
- Documentation: `reference/apps/ui/content/docs/components/toggle.mdx`
- Particles read in full: `p-toggle-1.tsx` through `p-toggle-8.tsx`
- Other complete usages read: `p-calendar-19.tsx`, `p-input-group-19.tsx`, `p-tooltip-2.tsx`, `p-tooltip-3.tsx`, `p-toolbar-1.tsx`, and the Toggle usage in `content/docs/components/toolbar.mdx`
- Migration notes checked: the Toggle and Toggle Group sections in `content/docs/(root)/radix-migration.mdx`, plus the March 20, 2026 Toggle Group entry in `content/docs/(root)/changelog.mdx`
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Shards files read in full: `src/lib/components/toggle/index.ts`, `toggle.svelte`, `tests/toggle/toggle.test.ts`, all three Toggle fixtures, `docs/src/content/toggle.md`, and the Toggle hero demo
- Installed `@shardsui/svelte@0.1.0-beta.0` Toggle source and generated declarations were also checked. They match the inspected local component behavior used by this wrapper.

## COSS contract

`Toggle` is one element. It wraps Base UI's toggle button, exports `toggleVariants`, writes `data-slot="toggle"`, and accepts the native/Base UI props plus these style props:

| Prop | Values | Default |
| --- | --- | --- |
| `variant` | `default`, `outline` | `default` |
| `size` | `default`, `sm`, `lg` | `default` |

The exact base class comes from `toggle.tsx`. It supplies the relative button shell, 10px corner radius, border, medium weight, responsive type, hover treatment, two-layer focus ring, disabled opacity, pressed fill, coarse-pointer target, and SVG sizing rules. The variant and size class strings remain unchanged in the Svelte wrapper.

The particles cover default and outline text buttons, an icon-only accessible toggle, all three sizes, disabled state, an independent icon row, and a controlled bookmark composition. `p-toggle-8` confirms that `pressed`, `onPressedChange`, a ref, and a changing accessible name are public behavior.

## rendered evidence

The live COSS page at `https://coss.com/ui/docs/components/toggle` was inspected in the Codex in-app Browser on August 27, 2026. The pinned source remains the code authority.

At widths above 640px, default, small, and large heights are 32px, 28px, and 36px. Their inline padding is 7px, 5px, and 9px. At 390px they become 36px, 32px, and 40px, and the font changes from 14px to 16px. All sizes retain a 10px radius and 500 font weight. The outline default button is 113.1328125px wide for `Outline Toggle` on the inspected desktop page. A default icon-only button is 32px square.

Clicking sets `aria-pressed="true"`, adds `data-pressed`, and applies the input color at 6.4% opacity in light mode. Disabled native buttons expose `disabled` and `data-disabled` and compute to 0.64 opacity. Keyboard Space and Enter use native button behavior through Shards.

## Svelte mapping

- `Toggle` transparently wraps Shards `Toggle`.
- `pressed` and `ref` stay bindable. `onPressedChange` remains a callback prop.
- Shards owns native and polymorphic button semantics, keyboard activation, disabled behavior, group registration, and hydration-stable generated values.
- `className` becomes Svelte's `class` prop. Consumer classes merge last through `cn`.
- `TogglePrimitive` exposes the unstyled Shards component for consumers who need it.
- No local state is stored outside the component. Standalone pressed state lives in the Shards part; a surrounding Toggle Group owns grouped state.

## verification

- SSR output for data attributes, native attributes, exact base classes, variants, sizes, disabled state, pressed state, and snippets
- Type coverage for native attributes, polymorphic `as`, bindable `pressed` and `ref`, callback props, and rejected style values
- Browser coverage for click, Enter, Space, disabled behavior, callback order, ref binding, controlled decline, and hydration without warnings
- The parity fixture reproduces particles 1 through 7. Particle 8 composes Toggle with Tooltip and anchored Toast; its exact port must wait for those components. A separate review probe exercises the controlled bookmark state without claiming to reproduce that particle.
- Focused SSR, browser, and Playwright parity suites pass. Playwright covers exact particle copy, icon names, geometry at desktop and mobile widths, pressed styling, both themes, and axe.
