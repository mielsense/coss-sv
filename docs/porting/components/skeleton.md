# Skeleton port evidence

## Sources inspected

- COSS commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
- Registry source: `reference/apps/ui/registry/default/ui/skeleton.tsx`
- Documentation: `reference/apps/ui/content/docs/components/skeleton.mdx`
- Particles: `reference/apps/ui/registry/default/particles/p-skeleton-1.tsx` and `p-skeleton-2.tsx`
- Other consumers: `reference/apps/ui/registry/default/particles/p-command-2.tsx`, `reference/apps/ui/app/particles/particles-display.tsx`, and the `SidebarMenuSkeleton` region in `reference/apps/ui/registry/default/ui/sidebar.tsx`
- Shards commit: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`
- Closest Shards source: every file under `shardsui/packages/shardsui/src/lib/components/progress/`
- Shards tests: `progress-root.test.ts`, `progress-indicator.test.ts`, `progress-label.test.ts`, `progress-value.test.ts`, and the basic and value-snippet fixtures under `shardsui/packages/shardsui/tests/progress/`
- Shards documentation and example: `shardsui/docs/src/content/progress.md` and `shardsui/docs/src/lib/components/content/demos/progress/hero/demo.svelte`

## COSS contract

Skeleton is a native div with `data-slot="skeleton"`. It merges the source animation, two-pixel default radius, fixed linear-gradient background, light and dark highlight tokens, and consumer classes. It forwards native attributes, callback props, snippets, and a bindable div ref.

The source animation is `skeleton 2s -1s infinite linear`; it moves the background position to -200%. COSS does not disable the animation under `prefers-reduced-motion`, so the port deliberately retains the same animation in both preference states. Shards Progress was inspected in full. Its determinate value, ARIA progressbar semantics, context, label, track, and indicator would misrepresent an indeterminate decorative placeholder, so Skeleton remains native.

## Browser evidence

Reference: `http://127.0.0.1:4000/ui/docs/components/skeleton`

Svelte: `http://127.0.0.1:5102/preview/skeleton?theme=<light|dark>&width=<mobile|desktop>`

The deterministic fixture keeps the exact second COSS particle untouched inside a separate neutral review shell. The particle root remains `flex w-full max-w-92 items-center gap-4` and is 40 pixels high. Review-only minimum height, centering, and padding are on its parent. At desktop width, the 368 pixel root produces 216/106/106 pixel text placeholders. At 390 by 844, the reference docs give p-skeleton-2 exactly 308 pixels of content width, so the port's neutral shell does the same. That root produces 168/82/82 pixel text placeholders. Both sizes retain the 40 pixel circular avatar and 68 by 24 pixel action placeholder. The two 50 percent placeholders each shrink by two pixels around their four-pixel flex gap. The in-app Browser confirmed the reference gradient, fixed attachment, 200% by 100% background size, highlight token, muted background, 2 second linear infinite animation, -1 second delay, sizes, and circular radius. The computed background position changes while the animation runs, so the E2E suite checks its exact 0 to -200 percent keyframe endpoints and live range instead of pinning a frame-dependent position. The Svelte DOM, geometry, and colors match at desktop and mobile widths. The light and dark routes have no console errors and no axe violations. The motion project and both reduced-motion theme projects assert the complete animation and background contract.

## Test coverage

- red-first SSR and type tests for exact classes, slot, consumer class precedence, native callbacks, snippets, and ref;
- browser callback/ref and hydration tests;
- exact particle fixture with Playwright light/dark, desktop/mobile, reduced/full-motion, exact text/action widths, the full gradient/highlight/background and animation contract, axe, and console coverage.

Accepted deviations: none.

## D4 documentation coverage

The page keeps `p-skeleton-1` and `p-skeleton-2` in upstream order. The first particle preserves its
loading timer, user copy, actions, and Hugeicons controls. The second retains the fixed avatar,
lines, and button placeholder geometry. The D4 inventory test locks metadata, icon authority, and
page order. The D4 route test opens both routes in light and dark, includes mobile coverage for the
responsive particle, and blocks external requests while preview timers stay manual. The focused
Skeleton Playwright gate covers axe and motion behavior independently of the manual-timer route
guard.
