# COSS for Svelte Documentation and Registry Plan

> This plan uses the repository's custom concurrent-agent workflow. It does not use the Superpowers subagent-driven-development skill.

**Goal:** Port the COSS component-library documentation site to SvelteKit with all current documentation pages and all 508 examples, publish the complete shadcn-svelte registry, and prove source, visual, interaction, accessibility, and installation parity.

**Architecture:** Authored content is compiled by SvelteKit and mdsvex. Svelte example modules live under `apps/ui/registry/default/particles/`, render inside deterministic preview routes, and are also exposed through registry JSON. The docs shell uses Svelte orange, while component previews retain unmodified COSS tokens. Generated inventories make missing or renamed pages and examples impossible to hide.

**Prerequisite:** The repository foundation and all 54 package components are complete, reviewed, and green.

**Specification:** `docs/specs/2026-08-26-coss-svelte-port-spec.md`

## Parallel documentation contract

Every documentation lane receives exclusive ownership of named content pages and a generated list of particle IDs. No two lanes edit the same example file. Shared navigation, source loaders, registry manifests, generated JSON, package manifests, and lockfiles remain coordinator-owned.

The current runtime provides three worker slots beside the coordinator. Fill all three with implementation lanes until the first handoff. Then run the two independent reviews for that handoff while one implementation lane continues. Keep the ready queue full and rotate completed reviews, fixes, and new lanes without a wave-wide wait.

### Implementation agent procedure for every page and particle

For each assigned documentation page, the agent must:

1. Freshly read the complete upstream MDX file listed in the lane table.
2. Follow every referenced component, example, callout, source link, image, and code tab to its actual file. Read each file completely.
3. Freshly read every upstream particle assigned to the page and every dependency it imports from `reference/apps/ui/registry/default/**`.
4. Run every assigned upstream example. Inspect exact text, data, order, icons, dimensions, responsive behavior, theme behavior, state transitions, focus, keyboard behavior, motion, and console output.
5. Freshly read the target Svelte component source and the matching local Shards source and docs. API references must describe the actual Svelte wrapper and Shards parts, not remembered React or Shards APIs.
6. Write failing page-inventory, example-inventory, source-display, and browser tests.
7. Port the page and every particle one for one. Preserve example identifiers, order, visible copy, data, icons, variants, and layout. Translate only syntax, framework-specific explanations, and explicitly approved branding.
8. Render every particle at its deterministic `/preview/<particle-id>` route and compare it with the React reference before committing.
9. Pass page, registry, source-copy, screenshot, interaction, keyboard, axe, and responsive checks for the assigned files.
10. Commit with the lane's lowercase subject and hand off exact source paths, page routes, particle routes, tests, known risks, and commit SHA.

The agent may not replace several upstream examples with one “representative” Svelte example. One upstream particle requires one Svelte particle with the same stable identifier.

### Documentation parity reviewer procedure

For every assigned page and particle, the reviewer must freshly read the upstream MDX and example files again. It must not rely on the implementation handoff or generated screenshots alone.

The reviewer then uses the in-app browser to compare source and target:

- every example at its canonical desktop size in light and dark themes;
- every responsive example at its upstream narrow/mobile size;
- every interactive example through all shown states with mouse and keyboard;
- exact prose meaning, headings, section order, visible copy, example order, icons, data, and code;
- preview geometry, computed styles, DOM semantics, ARIA, focus, reduced motion, console, and hydration;
- source, copy, install, API-reference, and navigation controls.

Every assigned example must receive an explicit pass or finding in the generated parity report. Sampling is not acceptance.

### Svelte content reviewer procedure

This reviewer runs concurrently and freshly reads the target source, component types, and local Shards API. It verifies:

- code samples compile as displayed;
- samples use Svelte 5 snippets, runes, callbacks, bindings, and namespace APIs correctly;
- install commands use pnpm and shadcn-svelte;
- API tables match actual exported Svelte props and parts;
- no React imports, hooks, JSX, Base UI React names, Bun commands, or legacy Svelte syntax remain;
- translated prose is accurate and concise;
- source and copy buttons return the exact displayed Svelte code;
- all authored prose passes the Unslop checklist.

Both approvals apply to an exact commit. Fixes receive focused re-review.

## Source inventory contract

The pinned reference contains:

- 55 component documentation pages;
- 7 root documentation pages;
- 2 hook pages;
- 508 particle files;
- 54 core registry components, with no standalone upstream sidebar documentation page;
- `date-picker` and `segmented-control` pages as documented compositions.

The target inventory must match these sets unless an explicit user-approved deviation says otherwise. Do not add a sidebar page merely to make the counts look symmetrical.

## Dependency waves

```text
D0 inventory and ownership map
├── D1 content compiler and source pipeline
├── D2 site shell, navigation, search, and preview chrome
└── D3 registry/docs infrastructure
    └── D4-D10 page and particle lanes, started concurrently by satisfied dependencies
        ├── D11 root and hook documentation
        ├── D12 registry publication and install UX
        └── D13 full-site parity, accessibility, and release gate
```

D1, D2, and D3 begin concurrently after D0. D4 through D10 enter the ready queue as soon as the shared preview, content, and registry interfaces they use are integrated. A lane does not wait for unrelated documentation lanes.

## Task D0: Generate the exact source inventory and file ownership map

**Owner:** coordinator
**Files:** `apps/ui/scripts/docs/inventory.mts`, `apps/ui/tests/docs/inventory.test.ts`, `docs/porting/docs-ownership.json`, generated sections of `docs/porting/PARITY-MATRIX.md`

### Step 1: Write the inventory test first

The test reads the live local reference and asserts the planning baseline:

```ts
expect(reference.componentPages).toHaveLength(55);
expect(reference.rootPages).toHaveLength(7);
expect(reference.hookPages).toHaveLength(2);
expect(reference.particles).toHaveLength(508);
expect(reference.registryComponents).toHaveLength(54);
```

The test must print the complete added/removed set if the local reference changes. It must not silently update expected counts.

### Step 2: Derive page-to-particle relationships

Parse MDX component invocations and registry metadata to identify every example referenced by each page. Also parse particle imports to list component dependencies.

Create a deterministic ownership rule:

1. explicit page reference owns the particle;
2. if several pages reference it, the first page in upstream `meta.json` owns the file and later pages reuse it;
3. unreferenced particles are owned by the component matching their filename prefix;
4. unresolved or multiply owned particles fail generation.

`docs-ownership.json` contains every particle exactly once with:

```ts
type DocsOwnership = {
  particle: string;
  primaryPage: string;
  consumingPages: string[];
  componentImports: string[];
  implementationLane: string;
  sourcePath: string;
  targetPath: string;
};
```

### Step 3: Write initial parity rows

Generate 508 particle rows and all page rows in `PARITY-MATRIX.md`. Initial target status is `missing`; generation is not allowed to call missing work complete.

### Step 4: Verify and commit

Run:

```bash
pnpm --filter @coss-sv/docs test -- inventory
pnpm exec tsx apps/ui/scripts/docs/inventory.mts --check
```

Commit:

```text
test(apps/ui): lock documentation inventory
```

## Task D1: Build the content, code, and source-display pipeline

**Can run with:** D2 and D3
**Exclusive files:** `apps/ui/src/lib/content/**`, `apps/ui/src/lib/code/**`, `apps/ui/scripts/docs/compile.mts`, `apps/ui/tests/content/**`, mdsvex configuration owned by this lane

### Step 1: Write failing compiler tests

Fixtures must prove:

- frontmatter and upstream `meta.json` ordering are preserved;
- Svelte code blocks are highlighted without altering copied source;
- component preview tags resolve to a particle ID;
- install commands render pnpm/shadcn-svelte tabs only;
- API tables accept typed Svelte metadata;
- Markdown routes preserve heading IDs and table of contents;
- invalid particle IDs, duplicate slugs, and React code imports fail the build.

### Step 2: Implement the content schema

Define typed page metadata for root, component, hook, migration, and changelog pages. Implement mdsvex components for:

- preview cards;
- code/source tabs;
- copy button;
- install command;
- callouts;
- API reference tables;
- file trees;
- linked headings;
- component status;
- previous/next navigation.

The compiler must expose the exact raw Svelte source used by copy buttons. It must not reconstruct source from rendered HTML.

### Step 3: Add agent-readable outputs

Expose content records that D11 can serve through `/llms.txt`, `/llms-full.txt`, and Markdown documentation routes. Keep one source of truth for HTML and Markdown output.

### Step 4: Verify and commit

Run content unit tests, `svelte-check`, a production build, and source-copy browser tests.

Commit:

```text
feat(apps/ui): add documentation content pipeline
```

## Task D2: Port the site shell, navigation, search, and preview presentation

**Can run with:** D1 and D3
**Exclusive files:** shared docs layouts and site components, search routes, header/footer, home presentation, preview frame presentation, site-only styles

### Step 1: Inspect the actual upstream shell

Freshly inventory and read the upstream Svelte-relevant equivalents under:

```text
reference/apps/ui/app/**
reference/apps/ui/components/**
reference/apps/ui/lib/**
reference/apps/ui/public/**
```

Use codebase graph discovery first for routes and components, then direct file reads. Run the upstream home, docs layout, component page, search, mobile navigation, and 404 state.

### Step 2: Write browser tests first

Tests cover:

- desktop and mobile header/navigation;
- documentation sidebar order and active state;
- search keyboard shortcut, results, empty state, and navigation;
- theme selection and hydration;
- table of contents behavior;
- source repository, credits, and Miel links;
- 404 state;
- preview fullscreen and responsive sizing controls;
- site orange isolation.

### Step 3: Implement the shell

Port the upstream visual system as closely as possible in SvelteKit. The approved branding deviation is:

```css
:root {
  --site-primary: #ff3e00;
}
```

Site controls may derive hover and muted orange values from this token. Installable component previews must retain COSS tokens. Record this single intentional difference in `DEVIATIONS.md` as user-approved.

Add a visible footer and credits link:

> Unofficial Svelte port made by Miel.

Link “Miel” to `https://github.com/mielsense`.

### Step 4: Verify visually

Use the in-app browser to compare the reference and target shell at the same desktop and mobile viewports in both themes. Measure sidebar, content width, code card, header, and preview frame geometry. The orange substitution is allowed; unrelated visual drift is not.

### Step 5: Commit

```text
feat(apps/ui): port documentation shell
```

## Task D3: Complete documentation registry and preview infrastructure

**Can run with:** D1 and D2
**Exclusive files:** particle loader, registry preview helpers, preview data fixtures, registry test helpers; aggregate manifests remain coordinator-owned

### Step 1: Write failing end-to-end contracts

Tests must prove:

- every owned particle module is discoverable by `import.meta.glob`;
- `/preview/<id>` renders the exact module and reports readiness;
- unknown IDs produce a stable 404;
- light/dark, direction, reduced-motion, locale, and viewport query parameters are deterministic;
- timers, random IDs, date/time, and network data can be pinned;
- source and install controls resolve the matching registry item;
- no preview inherits site orange as the component primary token.

### Step 2: Implement typed particle metadata

Each particle exports its component plus metadata:

```ts
type ParticleMeta = {
  id: string;
  title: string;
  containerClass?: string;
  iframeHeight?: number;
  components: string[];
  interactive: boolean;
  responsive: boolean;
};
```

Metadata values are derived from the upstream particle registry or page invocation, not invented from target rendering.

### Step 3: Add comparison helpers

Browser helpers capture:

- named element bounding boxes;
- selected computed CSS properties;
- accessibility tree and axe result;
- focus sequence and active element;
- console and hydration output;
- screenshots with stable masks only for genuinely nondeterministic browser UI.

### Step 4: Commit

```text
test(apps/ui): add documentation parity runtime
```

## Component documentation lane matrix

Every path below is read freshly. Each lane receives from `docs-ownership.json` all particles primarily owned by its pages. A composition page also reads every component and Shards primitive used by its particles.

| Lane | Pages | Mandatory upstream pages | Mandatory Shards focus |
| --- | --- | --- | --- |
| D4 | accordion, collapsible, tabs, separator, frame, card, empty, skeleton | `reference/apps/ui/content/docs/components/{accordion,collapsible,tabs,separator,frame,card,empty,skeleton}.mdx` | accordion, collapsible, tabs, separator; nearest field/button patterns for native components |
| D5 | button, toggle, toggle-group, checkbox, checkbox-group, radio-group, switch, slider | `reference/apps/ui/content/docs/components/{button,toggle,toggle-group,checkbox,checkbox-group,radio-group,switch,slider}.mdx` | the matching eight Shards component directories and docs pages |
| D6 | input, label, textarea, field, fieldset, form, group, input-group, number-field, otp-field | `reference/apps/ui/content/docs/components/{input,label,textarea,field,fieldset,form,group,input-group,number-field,otp-field}.mdx` | input, field, fieldset, form, button; local behavior records for number and OTP fields |
| D7 | dialog, alert-dialog, sheet, drawer, popover, preview-card, tooltip | `reference/apps/ui/content/docs/components/{dialog,alert-dialog,sheet,drawer,popover,preview-card,tooltip}.mdx` | dialog, alert-dialog, drawer, popover, preview-card, tooltip; dialog/drawer mapping for sheet |
| D8 | autocomplete, combobox, select, command, menu, context-menu, toolbar | `reference/apps/ui/content/docs/components/{autocomplete,combobox,select,command,menu,context-menu,toolbar}.mdx` | autocomplete, combobox, select, dialog, menu, context-menu, toolbar |
| D9 | calendar, date-picker, pagination, breadcrumb, table, scroll-area, segmented-control | `reference/apps/ui/content/docs/components/{calendar,date-picker,pagination,breadcrumb,table,scroll-area,segmented-control}.mdx` | field, input, popover, select, scroll-area, button, toggle-group, plus selected Svelte calendar docs |
| D10 | alert, avatar, badge, kbd, meter, progress, spinner, toast | `reference/apps/ui/content/docs/components/{alert,avatar,badge,kbd,meter,progress,spinner,toast}.mdx` | avatar, meter, progress, toast, plus nearest field/button patterns for native components |

The 55 page count is satisfied by these lanes. `sidebar` remains installable and tested in Plan 2 but has no invented docs page because the pinned reference has none.

## Task D4: Port disclosure and static-surface documentation

**Pages:** accordion, collapsible, tabs, separator, frame, card, empty, skeleton
**Exclusive examples:** every particle assigned to D4 by `docs-ownership.json`
**Commit:** `docs(apps/ui): port disclosure and surface examples`

Follow the full documentation contract for each of the eight pages and every assigned particle. Required review states include disclosure opening/closing, tabs keyboard navigation, disabled states, empty actions, skeleton animation, reduced motion, all variants, and light/dark rendering.

Accordion docs use the public namespace API:

```svelte
<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

The API reference links to the actual local wrapper parts and, where useful, the Shards accordion page.

## Task D5: Port control documentation

**Pages:** button, toggle, toggle-group, checkbox, checkbox-group, radio-group, switch, slider
**Exclusive examples:** every particle assigned to D5
**Commit:** `docs(apps/ui): port control examples`

Preserve every variant, size, icon, label, state, and form example. Review keyboard navigation, pressed/checked/indeterminate states, orientation, grouped values, slider range dragging, focus rings, disabled styling, and exact source code.

## Task D6: Port form and input documentation

**Pages:** input, label, textarea, field, fieldset, form, group, input-group, number-field, otp-field
**Exclusive examples:** every particle assigned to D6
**Commit:** `docs(apps/ui): port form and input examples`

Preserve the exact sample labels, descriptions, validation messages, placeholder text, addons, keyboard hints, data, and layout. Replace React form state with idiomatic Svelte bindings and derived state. Review native form submission, label activation, invalid relationships, number locale behavior, OTP paste/focus behavior, and mobile widths.

## Task D7: Port overlay documentation

**Pages:** dialog, alert-dialog, sheet, drawer, popover, preview-card, tooltip
**Exclusive examples:** every particle assigned to D7
**Commit:** `docs(apps/ui): port overlay examples`

Preserve all sides, sizes, nested examples, titles, descriptions, actions, and motion. Review portals, collision placement, focus trap, initial focus, dismissal, restoration, scroll locking, drag interaction, hover/focus delay, reduced motion, and mobile behavior for every assigned particle.

## Task D8: Port selection, command, and menu documentation

**Pages:** autocomplete, combobox, select, command, menu, context-menu, toolbar
**Exclusive examples:** every particle assigned to D8
**Commit:** `docs(apps/ui): port selection and menu examples`

Preserve exact item labels, icons, groups, shortcuts, filtering data, loading/empty states, submenu layout, and selected values. Review typeahead, roving or virtual focus, async changes, nested menus, check/radio items, context placement, form values, and exact code snippets.

## Task D9: Port date, navigation, table, and segmented-control documentation

**Pages:** calendar, date-picker, pagination, breadcrumb, table, scroll-area, segmented-control
**Exclusive examples:** every particle assigned to D9
**Commit:** `docs(apps/ui): port date and navigation examples`

Preserve exact dates by freezing the reference and target clock to the upstream example's expected date. Preserve locale, selection modes, table data, pagination labels, breadcrumbs, overflow, and responsive behavior. Segmented-control examples use the actual Svelte composition chosen in Plan 2, normally toggle-group or radio-group, without pretending it is a separate Shards primitive.

Review calendar keyboard grids, date-picker focus restoration, narrow tables, scrollbar presentation, current-page semantics, breadcrumb overflow menus, and all source blocks.

## Task D10: Port feedback and status documentation

**Pages:** alert, avatar, badge, kbd, meter, progress, spinner, toast
**Exclusive examples:** every particle assigned to D10
**Commit:** `docs(apps/ui): port feedback and status examples`

Preserve exact status text, images, initials, badge labels, keyboard chords, values, loading timing, toast content, actions, placement, and promise states. Pin image behavior and async timing for deterministic review without changing the visible result. Review live regions, fallback behavior, reduced motion, swipe/drag, stacking, and exact source.

## Per-lane acceptance gate for D4 through D10

Each lane runs:

```bash
pnpm --filter @coss-sv/docs test -- --run <lane-test-pattern>
pnpm --filter @coss-sv/docs check
pnpm --filter @coss-sv/docs registry:check
pnpm test:e2e --grep "<lane-id>"
pnpm exec tsx apps/ui/scripts/docs/inventory.mts --lane <lane-id> --check
```

The parity reviewer signs every assigned page and particle row. The Svelte content reviewer approves the same commit. The coordinator integrates lanes independently as they pass, updates aggregate manifests, rebuilds registry JSON, and runs affected cross-lane tests.

## Task D11: Port root pages, hooks, credits, and agent-readable docs

**Prerequisite:** D1 and D2; may run while D4 through D10 run
**Exclusive files:** target root docs, hook docs, credits/legal route, llms and Markdown routes
**Commit:** `docs(apps/ui): port guides hooks and credits`

### Step 1: Freshly read all source pages

Read completely:

```text
reference/apps/ui/content/docs/(root)/index.mdx
reference/apps/ui/content/docs/(root)/get-started.mdx
reference/apps/ui/content/docs/(root)/styling.mdx
reference/apps/ui/content/docs/(root)/skills.mdx
reference/apps/ui/content/docs/(root)/changelog.mdx
reference/apps/ui/content/docs/(root)/roadmap.mdx
reference/apps/ui/content/docs/(root)/radix-migration.mdx
reference/apps/ui/content/docs/hooks/use-copy-to-clipboard.mdx
reference/apps/ui/content/docs/hooks/use-media-query.mdx
reference/apps/ui/public/llms.txt
```

Follow and inspect every referenced code file.

### Step 2: Port framework-neutral meaning and rewrite framework-specific details

- `get-started`: pnpm and shadcn-svelte commands only.
- `styling`: actual Svelte registry, Tailwind, tokens, and CSS behavior.
- `skills`: current agent instructions for this repository, not React instructions.
- `radix-migration`: replace the React Radix/Base UI migration material with an accurate Svelte migration guide from shadcn-svelte/Bits UI to the Shards-backed COSS components. Retain the upstream page's purpose and structure where accurate.
- hooks: provide Svelte 5 `.svelte.ts` utilities only if the underlying hook exists in the target package; otherwise document the native Svelte pattern and do not invent an export.
- changelog and roadmap: preserve relevant COSS history with clear upstream labeling, then add a separate Svelte-port section.

Use Context7 for current Svelte and shadcn-svelte syntax. Pass all new prose through Unslop.

### Step 3: Add credit and legal content

The credits page visibly states:

> Unofficial Svelte port made by Miel.

It links to Miel, COSS, the exact upstream commit, `LICENSE`, `NOTICE.md`, and `THIRD_PARTY_NOTICES.md`, and says the project is not endorsed by COSS.

### Step 4: Add agent-readable routes

Implement `/llms.txt`, `/llms-full.txt`, and page-level Markdown responses from the same content records used by HTML. Tests compare headings, install commands, code source, and canonical URLs between formats.

### Step 5: Review

One reviewer checks every source page and wording transformation. A second verifies every command in a clean pnpm fixture and checks Svelte/API accuracy. Both review the credits placement and legal links.

## Task D12: Publish the final registry and installation experience

**Prerequisite:** all documentation lanes may still be under review, but all target files for a registry item must be integrated before that item publishes
**Owner:** coordinator plus registry implementation lane
**Files:** aggregate registry manifests, generated `registry.json`, `static/r/**`, install UI, registry smoke fixtures

### Step 1: Complete particle registry metadata

Add every one of the 508 particles to `registry-particles.ts` with the same stable ID as upstream. Dependencies must point to Svelte component items and Svelte icon packages or local licensed SVG components. Reject any React, Base UI React, Bun, npm, or upstream filesystem path.

### Step 2: Build and compare the registry set

Generate artifacts and assert:

```ts
expect(target.componentItems).toHaveLength(54);
expect(target.particleItems).toHaveLength(508);
expect(target.particleIds).toEqual(reference.particleIds);
```

Normalize ordering before comparison but do not normalize names, file content, or missing dependencies.

### Step 3: Verify install UI and CLI

Every component page displays:

```bash
pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/<component>.json
```

Test copy buttons and use the actual copied command in a temporary SvelteKit fixture. Smoke-install all 54 items individually across parallel temporary fixtures, then install the `ui` bundle once. Each fixture runs `svelte-check` and `vite build`.

Install a representative set of particles and verify their imports resolve without monorepo-only aliases.

### Step 4: Review and commit

A registry reviewer compares every JSON item to its source and target dependencies. A consumer reviewer follows only the deployed docs and install commands from a clean fixture.

Commit:

```text
feat(apps/ui): publish documentation registry
```

## Task D13: Full visual, accessibility, and release gate

**Prerequisite:** D1 through D12 integrated and individually approved
**Owner:** coordinator and independent integration reviewers

### Step 1: Run the complete 508-example matrix

Run the React reference at port `4000` and the integrated Svelte app at port `4173`. For all 508 example IDs:

- capture desktop light and desktop dark screenshots;
- capture DOM, accessibility, bounding-box, and selected computed-style snapshots;
- run axe;
- fail on console errors and hydration warnings;
- execute the declared interaction script for interactive examples;
- add narrow/mobile captures for every example marked responsive;
- run reduced-motion checks for every example with animation.

Do not update target baselines automatically. A changed screenshot requires a source comparison and reviewer decision.

### Step 2: Divide manual in-app review without sampling

Assign one independent parity reviewer per D4 through D10 ownership lane. Run the seven reviewers as a rolling pool at the maximum available concurrency. Each reviewer freshly reads its source pages and examples, then opens every example pair in the in-app browser and signs every row.

Assign separate cross-site reviewers for:

- home, shell, navigation, search, mobile menu, theme, and 404;
- root guides, hooks, credits, legal links, and agent-readable routes;
- registry source/copy/install behavior from a clean consumer app;
- keyboard-only traversal and screen-reader semantics across interactive component families.

### Step 3: Run the clean release candidate gate

From a new worktree:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm verify
pnpm test
pnpm build
pnpm --filter @coss-sv/ui pack:check
pnpm --filter @coss-sv/docs registry:build
pnpm --filter @coss-sv/docs registry:check
pnpm --filter @coss-sv/docs registry:smoke
pnpm test:e2e
pnpm exec tsx apps/ui/scripts/docs/inventory.mts --check
node scripts/check-forbidden-paths.mjs
git diff --exit-code
```

Expected:

- 54 component items;
- 55 component documentation pages;
- 7 root pages;
- 2 hook pages or explicit native-Svelte replacements at the same routes;
- 508 uniquely named Svelte particles;
- zero missing, extra, duplicated, or unreviewed parity entries;
- zero unapproved deviations;
- no forbidden files in Git or package output;
- exact Svelte orange `#ff3e00` in docs chrome and unchanged COSS component tokens in previews;
- visible COSS and Miel attribution;
- all registry install fixtures build.

### Step 4: Recheck provenance and prose

The release provenance reviewer reads the current `reference/LICENSING.md`, COSS `apps/ui` package license metadata, Shards license, every evidence source path, and all third-party notices. Any source outside the approved MIT subtree blocks release.

Run README, guides, contribution text, issue templates, and release notes through the Unslop checklist one last time.

### Step 5: Deployment readiness

Verify the production adapter, canonical URL, sitemap, robots policy, Open Graph metadata, registry content types, caching headers, and 404 behavior. Deploy a preview and rerun registry installation against the preview URL before promoting production.

Do not publish an npm package or create a public release until `@coss-sv/ui` ownership and the `coss-sv.vercel.app` production domain are confirmed. Documentation deployment itself is allowed once the configured project is confirmed.

### Step 6: Final commits

Use scoped lowercase subjects for findings, for example:

```text
fix(apps/ui): align accordion examples
fix(apps/ui): restore mobile navigation focus
docs(apps/ui): clarify svelte registry installation
chore(repo): prepare documentation release
```

The plan is complete only when every parity row is approved, every final reviewer approves the same HEAD, the deployed preview passes the install smoke test, and the clean release gate is green.
