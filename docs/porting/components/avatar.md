# Avatar port evidence

## COSS files inspected

- Implementation: `reference/apps/ui/registry/default/ui/avatar.tsx`
- Documentation: `reference/apps/ui/content/docs/components/avatar.mdx`
- Avatar particles: `p-avatar-1.tsx` through `p-avatar-14.tsx`
- Other direct importers: `p-button-28.tsx`, `p-combobox-19.tsx`, `p-combobox-20.tsx`, `p-group-23.tsx`, `p-popover-3.tsx`, `p-select-19.tsx`, `p-select-20.tsx`, and `p-skeleton-1.tsx`

All 22 direct importers under `reference/apps/ui/registry/default/particles/` were read in full. The scan required the exact module specifier `@/registry/default/ui/avatar`; generated registry JSON and `registry/__index__.tsx` were treated as mirrors, not independent examples.

The root is a `span` with `data-slot="avatar"` and a fixed 32px circular layout. The image has `data-slot="avatar-image"`, full size, and `object-cover`. The fallback has `data-slot="avatar-fallback"`, full size, a muted background, and centered content. The image primitive controls whether the image or fallback is mounted. COSS adds no transition classes.

## Shards files inspected

Every file under `shardsui/packages/shardsui/src/lib/components/avatar/` and `shardsui/packages/shardsui/tests/avatar/` was read, along with `shardsui/docs/src/content/avatar.md` and `shardsui/docs/src/lib/components/content/demos/avatar/hero/demo.svelte`. The installed beta.0 runtime and types under `packages/ui/node_modules/@shardsui/svelte/dist/components/avatar/` were also checked. Its Svelte behavior matches the local beta.1 source; the source diffs are import-path rewrites.

Shards supplies the loading state, error handling, delayed fallback, refs, polymorphic elements, `srcset`, and `onLoadingStatusChange`. The port wraps each part without adding state. Its local barrel re-exports Shards' `ImageLoadingStatus` type.

The hydration test uses one fixture composed from `Avatar.Root`, `Avatar.Image`, and `Avatar.Fallback`. The server render contains the real fallback subtree and no image. The browser hydrates that markup with a deterministic `Image` probe, checks the loading fallback, triggers a successful load, then changes the source and triggers an error. The image and fallback swap correctly in both directions, and hydration logs no warning.

## Rendered reference check

The first React docs preview rendered a 32px `span` root and 32px fallback. Its external Unsplash image failed in the isolated browser, so the fallback text `LT` was visible. Neither element had an animation. The Codex in-app Browser returned `Browser is not available: iab`; no external browser fallback was used. Headless browser checks remain the recorded visual and runtime evidence until an independent in-app review is available.

## Documentation port evidence (D10)

The D10 port freshly inspected the complete permitted COSS registry component, MDX page, every owned particle, and every local Shards source, documentation, test, example, and exported type available for this component. The Svelte page keeps the upstream preview order and visible copy. Each owned preview has a deterministic route and an exact ownership record in `docs/porting/docs-ownership.json`. UI icons use Hugeicons. No Lucide code or copied SVG path is present.

The focused D10 tests cover the page and particle inventories, SSR compilation, modern Svelte syntax, icon authority, status semantics, async state changes, and reduced-motion-sensitive source. Accepted deviations: the install command uses the shadcn-svelte registry CLI, and API prose describes the Svelte wrapper and Shards parts rather than Base UI React.

The Codex in-app Browser loaded the pinned `p-avatar-1` image and exposed the exact `Luke Tracy` alternative text. The root measured 32 by 32 pixels with a full circular radius and no horizontal overflow.
