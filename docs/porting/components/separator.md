# Separator port evidence

## Source files inspected

The port uses only the MIT-designated COSS application tree.

- `reference/apps/ui/registry/default/ui/separator.tsx`
- `reference/apps/ui/content/docs/components/separator.mdx`
- `reference/apps/ui/registry/default/particles/p-separator-1.tsx`
- `reference/apps/ui/registry/default/particles/p-frame-4.tsx`

The source search found two particles that import the standalone Separator. Both files were read in full. Other matches use separate compound-component parts such as `MenuSeparator`, `GroupSeparator`, and `ToolbarSeparator`.

The Shards comparison covered every file in its Separator directory, the package re-export, the referenced shared types and data-attribute helper, and its documentation:

- `shardsui/packages/shardsui/src/lib/components/separator/index.ts`
- `shardsui/packages/shardsui/src/lib/components/separator/separator.svelte`
- `shardsui/packages/shardsui/src/lib/index.ts`
- `shardsui/packages/shardsui/src/lib/internal/data-attrs.ts`
- `shardsui/packages/shardsui/src/lib/internal/types.ts`
- `shardsui/docs/src/content/separator.md`

Shards has no Separator-specific tests or additional examples under the component directory.

## COSS contract

COSS renders the Base UI Separator and defaults `orientation` to `horizontal`. It adds `data-slot="separator"` and merges this class list before the consumer class:

```text
shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch
```

The final prop spread follows the explicit class, slot, and orientation props. The wrapper therefore forwards native attributes, callbacks, `children`, and the primitive ref contract. Consumer classes win Tailwind conflicts through `cn`.

The docs call the component an accessible dividing line. The example renders one horizontal line with `my-4` and three vertical lines between Blog, Docs, Source, and Releases. The Frame particle uses the default horizontal line between stacked panels.

## Shards contract

Shards renders a dynamic element, defaulting to `div`. It binds `ref`, defaults to horizontal orientation, and adds:

- `role="separator"`
- `aria-orientation` matching the orientation
- `data-orientation` matching the orientation

Its remaining native attributes and callbacks are spread last. Shards accepts an `as` prop but deliberately omits `children` from its Separator props. The COSS wrapper accepts the React primitive's full prop type, so the Svelte port must keep snippet rendering without changing the default Shards DOM.

The wrapper uses Shards for the ordinary no-content case. When a consumer supplies a snippet, it renders an equivalent semantic element because the current Shards component discards `children`. Both paths preserve the same role, orientation attributes, slot marker, styles, callback forwarding, class precedence, and bindable ref.

## Browser evidence

Reference route: `http://127.0.0.1:4000/ui/docs/components/separator`

Temporary Svelte review route: `http://127.0.0.1:5101/@fs/private/tmp/coss-separator-preview/index.html?theme=dark`

The manual pass used the Codex in-app Browser. At 1280 by 900 and 390 by 844, the reference rendered:

- a horizontal `DIV` with `role="separator"`, `aria-orientation="horizontal"`, `data-orientation="horizontal"`, and `data-slot="separator"`;
- a 288 by 1 pixel horizontal rule with 16 pixel vertical margins in the docs particle;
- vertical rules that were 1 by 20 pixels and stretched to the height of the flex row;
- `flex-shrink: 0` in both orientations;
- the dark border token as `oklab(0.999994 0.0000455678 0.0000200868 / 0.06)`.

At 1280 by 900, the Svelte fixture matched the four reference separators, attributes, class list, 288 by 1 pixel horizontal rule, 1 by 20 pixel vertical rules, margin, stretch, and dark border value. The reference theme button remained on the dark class in this local runtime, so the light reference could not be captured through the visible control. The in-app Browser's temporary viewport override hung while switching the Svelte fixture to 390 by 844 and was stopped. The reference narrow measurement above remains available, and the fixture uses width-independent component rules.

The component uses `bg-border`; package token tests cover its light and dark values. A separator has no focus target or keyboard interaction. Its semantic role and orientation remain exposed to assistive technology.

## Test coverage

- browser rendering for native attributes, callback props, class precedence, ref binding, snippets, and Shards state attributes;
- SSR rendering for default and vertical orientations plus snippet output;
- type checks for native attributes, callbacks, orientation, snippets, `as`, and ref;
- local barrel exports;
- the repository-wide no-legacy-syntax gate;
- package build and publish-content checks.
