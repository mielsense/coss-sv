# COSS for Svelte Port Specification

**Status:** Approved planning baseline
**Date:** 2026-08-26
**Working repository:** `mielsense/coss-sv`
**Working package name:** `@coss-sv/ui`
**Working documentation URL:** `https://coss-sv.vercel.app`

## Product definition

COSS for Svelte is a high-fidelity Svelte 5 port of the COSS UI component library and its documentation. It preserves the upstream component styling, states, examples, interaction behavior, and accessibility while exposing idiomatic Svelte APIs built on Shards UI.

The project is an unofficial port made by [Miel](https://github.com/mielsense). It must credit COSS and every reused dependency without implying sponsorship or endorsement.

The target is not a mechanical JSX conversion. The rendered result must match COSS, while the implementation must be native, current Svelte 5 code.

## Scope decision

The requested product workspaces are sufficient:

- `apps/ui/`: the SvelteKit documentation site, examples, registry metadata, and registry artifacts.
- `packages/ui/`: the canonical Svelte component source and public package surface.
- `packages/typescript-config/`: shared TypeScript configurations.
- `biome.json`: the shared formatter and linter configuration.

A usable monorepo also needs a small set of root infrastructure files. These are supporting files, not additional products:

- `package.json`
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `turbo.json`
- `.gitignore`
- `README.md`
- `LICENSE`
- `NOTICE.md`
- `THIRD_PARTY_NOTICES.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CODE_OF_CONDUCT.md`
- `.github/` workflows and contribution templates

The following upstream workspaces are explicitly out of scope:

- `apps/www/`
- `apps/origin/`
- `apps/examples/`
- React package output and React-only tooling
- Bun configuration or Bun lockfiles

## Source authority and provenance

The local comparison inputs are working material only:

- COSS reference: `reference/`, pinned during planning at commit `19620ae8cae81e30775f2cde03829326cb4916b2`.
- Shards UI reference: `shardsui/`, pinned during planning at commit `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`.
- Prior Svelte port precedent: `/Users/honey/code/staging/evilcharts-svelte`.

`reference/`, `shardsui/`, `.worktrees/`, browser profiles, screenshots, traces, and parity artifacts must be ignored by Git and must never be included in a commit.

### COSS source hierarchy

For component code, the authoritative source is:

1. `reference/apps/ui/registry/default/ui/*.tsx`
2. `reference/apps/ui/registry/default/lib/**`
3. `reference/apps/ui/registry/default/hooks/**`
4. `reference/apps/ui/registry/default/particles/**`
5. `reference/apps/ui/content/docs/**`

`reference/apps/ui/scripts/sync-ui.mts` shows that `reference/packages/ui/src/components/**` is generated from the registry source with import rewrites. Agents must not copy from `reference/packages/ui/**`, because the repository default license applies there and the directory is not needed as a source of truth.

When implementation and rendered behavior appear to disagree, the order of evidence is:

1. the running upstream documentation example;
2. its particle source;
3. the registry component source;
4. the component documentation;
5. generated React package output, for comparison only.

### Shards UI source hierarchy

For every behavioral primitive, an agent must inspect the current local Shards files, not recall an earlier inspection:

1. `shardsui/packages/shardsui/src/lib/components/<component>/**`
2. `shardsui/docs/src/content/<component>.md`
3. related Shards tests and examples
4. the exported types for the part being wrapped

The public website can be used as a secondary cross-check. The local source pinned with the project remains the implementation authority.

## Licensing policy

The upstream repository declares `apps/ui/` as MIT-licensed in `reference/LICENSING.md`, and `reference/apps/ui/package.json` also declares MIT. The root COSS repository is otherwise AGPL-3.0.

The port therefore uses this conservative boundary:

- Adapt only the explicitly MIT-designated `reference/apps/ui/**` subtree.
- Do not copy from `reference/packages/ui/**`, the root README, or other AGPL-default paths.
- If a required detail exists only in an AGPL-default path, stop that task and record a licensing decision before using it.
- Preserve copyright ownership. Do not replace upstream authorship with the port author's name.
- Add a standard MIT `LICENSE` for the port.
- Add `NOTICE.md` with the COSS project URL, exact source commit, the MIT-designated source paths, a description of modifications, and the Miel attribution.
- Add `THIRD_PARTY_NOTICES.md` with the complete license text or required notice for Shards UI and every redistributed asset or source fragment.
- State that this is an unofficial Svelte port and is not endorsed by COSS.

The intended notice language is:

> COSS for Svelte is an unofficial Svelte port of COSS UI. Portions are adapted from the MIT-licensed `apps/ui` subtree of COSS. The port was made by Miel. COSS and all upstream contributors retain their respective rights.

This specification is a provenance policy, not legal advice. Before the first public release, a release reviewer must re-check the upstream license files at the pinned commit and confirm that every adapted file is inside the declared MIT subtree.

## Technology baseline

The initial baseline follows the current local Shards UI toolchain so the wrapper layer does not straddle incompatible Svelte generations:

| Concern | Baseline |
| --- | --- |
| Runtime | Node.js `>=22.18 <25` |
| Package manager | pnpm `10.22.0` |
| Task runner | Turborepo `2.10.12` |
| Framework | Svelte `5.56.10`, SvelteKit `2.70.3` |
| Build | Vite `8.2.2`, `@sveltejs/vite-plugin-svelte` `7.3.0` |
| Language | TypeScript `^6.0.3`, strict mode |
| Headless primitives | Published `@shardsui/svelte` `0.1.0-beta.0`, pinned exactly, with local `0.1.0-beta.1` source used for inspection and guarded by compatibility tests until it is published |
| Styling | Tailwind CSS 4, CSS custom properties, upstream COSS class strings |
| Formatting and linting | Biome `2.5.10` with Svelte full support enabled |
| Static analysis | `svelte-check` `4.7.6` |
| Unit and component tests | Vitest `4.1.11` browser and node projects, `@testing-library/svelte` |
| End-to-end tests | Playwright `1.62.1` |
| Registry CLI | `shadcn-svelte@latest`, resolved and recorded in the lockfile or CI metadata |

No Bun scripts, `bun.lock`, npm lockfiles, ESLint, or Prettier are introduced. A formatter exception is allowed only after a reproducible Biome defect is documented.

The shadcn-svelte custom registry feature is still experimental. Registry generation and installation must therefore be covered by pinned smoke tests rather than trusted as an unverified build step.

## Repository architecture

```text
.
├── apps/
│   └── ui/
│       ├── content/docs/
│       ├── registry/
│       │   ├── default/
│       │   │   └── particles/
│       │   ├── registry-ui.ts
│       │   └── registry-particles.ts
│       ├── scripts/
│       ├── src/
│       │   ├── lib/
│       │   └── routes/
│       ├── static/r/
│       └── package.json
├── packages/
│   ├── typescript-config/
│   └── ui/
│       ├── src/components/ui/
│       ├── src/hooks/
│       ├── src/lib/
│       ├── src/styles/
│       └── package.json
├── docs/
│   ├── porting/
│   ├── specs/
│   └── superpowers/plans/
├── biome.json
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

`packages/ui/` is the only canonical source for installable components. Registry JSON points to those files. The documentation app imports the workspace package. There is no copied second component tree under `apps/ui/`.

Examples are canonical under `apps/ui/registry/default/particles/` because they are documentation and registry content, not package internals.

## Svelte implementation standard

All new components use Svelte 5 syntax exclusively:

- TypeScript in every component and module.
- `$props()` with explicit prop types.
- `Snippet` props and `{@render ...}` instead of slots.
- callback props instead of `createEventDispatcher`.
- `$bindable()` only for a documented two-way contract.
- `$derived` for derived values and `$effect` only for external side effects.
- `createContext` for typed compound component state.
- typed native attributes from `svelte/elements`.
- rest-prop forwarding to the rendered element or Shards part.
- `$props.id()` when stable generated IDs are required.
- declaration tags where generic component typing needs them.

Legacy `export let`, `on:click`, `createEventDispatcher`, `<slot>`, Svelte stores used as local component state, and mixed legacy/runes components are rejected.

DOM access must use actions or attachments when practical. Lifecycle code must be safe during server rendering.

## Public component API

The public API follows common shadcn-svelte namespace conventions.

Single-element components use named imports:

```svelte
<script lang="ts">
  import { Button } from "@/components/ui/button/index.js";
</script>

<Button>Save changes</Button>
```

Compound components use namespace imports and an explicit `.Root` part:

```svelte
<script lang="ts">
  import * as Accordion from "@/components/ui/accordion/index.js";
</script>

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

The package may export named compatibility aliases such as `AccordionRoot`, but documentation and generated examples use the namespace API. No runtime namespace construction with `Object.assign` is used.

Prop names should follow Shards when they describe the same behavior. A COSS-facing wrapper may translate a Shards prop only when translation preserves an upstream example or improves Svelte idiom without losing capability. Every translation is recorded in `docs/porting/components/<component>.md`.

## Component inventory and primitive strategy

All 54 upstream registry components are in scope.

### Direct Shards wrappers

These components have a direct Shards primitive and must wrap it while preserving COSS classes and public composition:

`accordion`, `alert-dialog`, `autocomplete`, `avatar`, `button`, `checkbox`, `checkbox-group`, `collapsible`, `combobox`, `context-menu`, `dialog`, `drawer`, `field`, `fieldset`, `form`, `input`, `menu`, `meter`, `popover`, `preview-card`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `slider`, `switch`, `tabs`, `toast`, `toggle`, `toggle-group`, `toolbar`, and `tooltip`.

### Composed or native Svelte components

These are styled elements or compositions and should use semantic Svelte markup plus the nearest Shards parts where behavior is required:

`alert`, `badge`, `breadcrumb`, `card`, `command`, `empty`, `frame`, `group`, `input-group`, `kbd`, `label`, `pagination`, `sheet`, `sidebar`, `skeleton`, `spinner`, `table`, and `textarea`.

Specific compositions include:

- `command`: Shards autocomplete and dialog behavior with the COSS command surface.
- `sheet`: Shards dialog behavior with COSS edge placement and motion.
- `label` and `textarea`: semantic native elements integrated with Shards field context where present.
- `sidebar`: native layout plus Shards tooltip, drawer, and menu primitives as required by the upstream responsive behavior.

### Components without a direct Shards equivalent

- `calendar`: port the COSS DayPicker-facing API from the allowed COSS source. Start from the required behavior and the nearest local Shards primitives, then choose a Svelte-native composition that preserves visual, keyboard, locale, range, and disabled-date parity. A shadcn-svelte implementation is not a design or dependency authority. Any additional runtime dependency requires COSS-specific evidence and coordinator approval.
- `number-field`: implement a local Svelte behavior layer around Shards field/input parts, including locale-aware parsing, steppers, keyboard behavior, constraints, and controlled state.
- `otp-field`: implement a local Svelte behavior layer around Shards field/input parts, including paste, focus movement, deletion, selection, completion, and mobile input behavior.

Adding another headless library for a missing primitive requires a short decision record showing that a local implementation would be less maintainable or less accessible.

## Visual and behavioral parity

“Exact” means the Svelte version preserves all observable characteristics that matter to a user or integrator:

- element geometry, gaps, padding, alignment, wrapping, and responsive behavior;
- font family, weight, size, line height, letter spacing, and text wrapping;
- foreground, background, border, ring, shadow, opacity, and dark-theme values;
- every upstream variant, size, default, data attribute, CSS variable, and state class;
- DOM semantics and accessible name/description relationships;
- keyboard navigation, focus order, focus restoration, dismissal, pointer behavior, and typeahead;
- controlled and uncontrolled state where the Svelte primitive supports the distinction;
- opening, closing, dragging, loading, indeterminate, disabled, invalid, and reduced-motion behavior;
- server rendering and hydration without warnings;
- every public example and its visible copy, icons, data, state, layout, and ordering.

Source shape does not need to match React. Rendered semantics and behavior do.

Animation should first use Shards state attributes and COSS CSS. `@humanspeak/svelte-motion` is not a baseline dependency because the current COSS package and documentation app do not import Motion. It may be added only for a named component after the reference proves a motion behavior that CSS and Shards cannot reproduce. That decision must cite current documentation fetched through Context7 and include reduced-motion coverage.

## Required per-component evidence

Before an implementation agent writes code for a component, it must perform and record all of these fresh inspections:

1. Read the complete COSS registry component file.
2. Read the complete COSS component documentation page.
3. Read every COSS particle that imports or demonstrates the component.
4. Run the relevant upstream examples and inspect their rendered DOM, computed styles, states, and interactions.
5. Read the complete local Shards source directory for the matching primitive.
6. Read the complete local Shards documentation page, tests, and relevant examples.
7. If no direct Shards primitive exists, read the closest Shards field, form, input, overlay, or collection implementation and record why it was selected.

The evidence is written to `docs/porting/components/<component>.md` with:

- exact source paths and pinned commits;
- upstream exports and example inventory;
- COSS class and token inventory;
- required state and accessibility behavior;
- Shards part and prop mapping;
- intentional Svelte API translations;
- tests and preview routes;
- accepted deviations, normally “none.”

Memory, a summary from another agent, or an earlier component inspection does not satisfy this requirement.

## Review standard

Every implementation lane receives two independent reviews before integration.

### Parity and accessibility review

The reviewer must freshly read the same COSS and Shards inputs. It must then compare the running React reference and Svelte implementation in the in-app browser.

The Codex in-app browser is the only manual visual-review surface. Agents must not use the Chrome app or Chrome connector. Headless Playwright is reserved for deterministic automated coverage.

The review covers:

- matching light and dark themes;
- desktop and narrow/mobile layouts;
- default, hover, active, focus-visible, open, closed, disabled, invalid, checked, selected, loading, and destructive states when applicable;
- mouse, touch-representative pointer, and keyboard operation;
- accessible names, roles, states, relationships, live regions, focus trapping, and focus restoration;
- reduced-motion behavior;
- exact example copy, data, icon choice, ordering, and layout;
- browser console and hydration output.

Reviewers compare numeric geometry and computed CSS values when a screenshot is ambiguous. They attach measurements, screenshots, or a precise source reference to every finding.

### Svelte quality review

The reviewer freshly reads the implementation and Shards types and verifies:

- current Svelte 5 patterns;
- correct prop and snippet typing;
- attribute, event callback, action, attachment, and ref forwarding;
- no accidental legacy Svelte syntax;
- SSR and hydration safety;
- stable package exports and tree-shakeable modules;
- focused tests for the behavioral contract;
- no unrelated dependency or abstraction.

Both reviewers must approve the exact commit. A change made after approval invalidates the affected review.

## Documentation specification

The SvelteKit site ports the complete current `apps/ui` documentation experience that concerns the component library.

### Content parity

- Port every current component page.
- Port the `segmented-control` and `date-picker` documentation surfaces even though they are compositions rather than separate core registry files.
- Port all 508 current particle examples one for one.
- Preserve example names, page order, section order, prose meaning, visible copy, test data, icons, variants, and layout.
- Translate JSX and React state management into idiomatic Svelte syntax.
- Rewrite React-only API explanations into accurate Svelte and Shards explanations.
- Generate API reference tables from the actual Svelte wrapper types and the inspected Shards parts. Never paste React prop tables unchanged.
- Preserve source, copy, preview, code, and install interactions.

A machine-generated parity matrix must compare the upstream and Svelte particle identifiers. Missing, renamed, duplicated, or extra examples fail CI unless the difference is listed in the deviations ledger with a user-approved reason.

### Site design

The documentation chrome uses Svelte orange `#ff3e00` as its primary brand color. The orange is scoped to site navigation, links, active states, and documentation controls.

Installable COSS component tokens remain faithful to COSS. Preview routes reset component theme variables so the documentation brand color cannot change component screenshots or copied registry output.

The site includes a visible credits section and footer link with this statement:

> Unofficial Svelte port made by [Miel](https://github.com/mielsense).

The credits page also links to COSS, identifies the pinned source revision, explains the MIT source boundary, and links to `LICENSE`, `NOTICE.md`, and `THIRD_PARTY_NOTICES.md`.

All authored README, documentation, contributor, issue-template, and release text is passed through the Unslop editing checklist before merge.

### Deterministic preview routes

Every particle is directly renderable at a stable route such as:

```text
/preview/<particle-name>?theme=light&width=desktop
```

Preview routes remove documentation chrome, pin deterministic data and time, disable unrelated network calls, and expose a readiness marker for Playwright. They are the basis for source-versus-port visual comparison.

## Registry and installation

The public installation path uses the shadcn-svelte CLI.

```bash
pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/accordion.json
```

Registry requirements:

- `apps/ui/registry/registry-ui.ts` is the typed manifest for all 54 components and bundles.
- `apps/ui/registry/registry-particles.ts` is the typed manifest for all examples.
- The source manifest points at canonical files in `packages/ui/` and example files in `apps/ui/registry/`.
- A generator writes shadcn-svelte-compatible `registry.json` input.
- `shadcn-svelte registry build` writes artifacts to `apps/ui/static/r/`.
- Generated artifacts are committed so the deployed site can serve static registry endpoints.
- A freshness test rebuilds into a temporary directory and byte-compares normalized output.
- A smoke test creates a minimal SvelteKit fixture, initializes shadcn-svelte, installs representative leaf, compound, overlay, special, and bundle items by URL, then runs `svelte-check` and a production build.
- Registry dependencies, CSS variables, aliases, file destinations, and peer dependencies are verified after installation.

The package workspace remains buildable and publishable, but the hosted registry is the primary consumer path for the initial release.

## Testing architecture

### Unit and component tests

Tests assert user-observable behavior:

- prop, attribute, callback, ref, snippet, action, and attachment forwarding;
- controlled and bindable state;
- keyboard navigation and focus movement;
- overlay dismissal and restoration;
- ARIA roles, properties, relationships, and announcements;
- invalid, disabled, selected, checked, and open states;
- locale and input edge cases for special components;
- context behavior through wrapper test components;
- SSR render and hydration smoke coverage.

### Browser parity tests

Playwright runs the upstream reference on port `4000` and the integrated Svelte preview app on a fixed target port. It collects:

- per-particle screenshots in light and dark themes;
- DOM and accessibility snapshots;
- computed style and bounding-box data for named anchors;
- keyboard traces for interactive components;
- console errors and hydration warnings.

Image diffs are a signal, not the sole oracle. Differences caused by font rendering or browser rasterization are resolved with computed values and DOM inspection.

### Accessibility

Automated checks use axe in addition to semantic assertions. Manual keyboard review is mandatory for every interactive component family. Automated success cannot overrule a broken manual interaction.

## Custom parallel-agent protocol

This project does not use the Superpowers subagent-driven-development skill.

The coordinator uses a custom workflow designed for real concurrency. In the current four-slot runtime, one slot is the coordinator and three are workers. The default schedule is three implementation agents until the first handoff, then two reviewers on that handoff while one implementation agent continues. When reviews finish, freed slots immediately take the next ready implementation or fix. If a later runtime exposes more slots, the same ownership rules expand without changing task boundaries.

The workflow is:

1. Create one isolated Git worktree per implementation lane under `.worktrees/`.
2. Assign an exact task brief and exclusive file ownership to each implementation agent.
3. Enqueue every dependency-free implementation lane and keep every available worker slot occupied.
4. Keep root manifests, lockfiles, aggregate barrels, registry indexes, navigation indexes, and shared generated files coordinator-owned unless a task grants them exclusively.
5. When an implementation lane produces a reviewable commit, start its parity/accessibility reviewer and Svelte-quality reviewer concurrently while at least one other implementation lane continues whenever ready work exists.
6. Send findings back to the same implementation lane. Reviewers inspect the new commit again after fixes.
7. Integrate only a commit approved by both reviewers.
8. Run affected integration tests after each cherry-pick and the full gate after each wave.
9. Start the next dependency wave as soon as its required commits land. Do not wait for unrelated lanes in the current wave.

An agent must not edit another lane's files or a coordinator-owned file. If it discovers a shared change, it writes a finding for the coordinator rather than making the edit.

Review browser ports are allocated per lane. The React reference may be shared read-only on port `4000`; Svelte lanes use deterministic non-overlapping ports.

## Commit policy

Commit subjects are lowercase Conventional Commits with a scoped workspace:

```text
chore(repo): configure pnpm workspace
feat(packages/ui): add accordion
test(packages/ui): cover accordion interactions
docs(apps/ui): port accordion examples
fix(apps/ui): align preview spacing
refactor(packages/ui): simplify field context
```

Each implementation lane produces small, reviewable commits. Generated registry output may be committed with the manifest change that produced it. A review fix uses a separate commit until integration, where the coordinator may preserve or squash it according to repository policy.

## CI, delivery, and repository setup

Pull requests run:

1. frozen pnpm install;
2. provenance and forbidden-path checks;
3. Biome format and lint checks;
4. `svelte-check` for both workspaces;
5. unit and component tests;
6. package build and packaging validation;
7. docs production build;
8. registry schema, freshness, and install smoke tests;
9. Playwright browser tests;
10. example and documentation parity matrix checks.

Nightly or manually dispatched workflows run the complete reference-versus-port visual matrix because 508 examples in two themes are too expensive to make every small pull request wait for the entire suite. Pull requests run all affected examples plus a stable cross-family smoke matrix. A pull request that changes shared tokens or preview infrastructure runs the full matrix.

GitHub configuration includes:

- a CI workflow;
- CodeQL for JavaScript and TypeScript;
- Dependabot for pnpm and GitHub Actions;
- issue templates for bugs, component parity, and feature requests;
- a pull request template with provenance, accessibility, visual, and license checkboxes;
- branch protection documented for `main`;
- Vercel deployment instructions for `apps/ui`.

Automated publishing is not enabled until the package name and registry domain are confirmed in a release decision. Preview and production documentation deployment can be enabled immediately after the foundation gate passes.

## Agent-facing repository documentation

The repository includes:

- `AGENTS.md` with the source hierarchy, mandatory fresh-inspection rule, file ownership rules, commands, and review contract;
- `docs/porting/PARITY-MATRIX.md` generated from source inventories;
- `docs/porting/DEVIATIONS.md` with no silent deviations;
- `docs/porting/PITFALLS.md` for Svelte, Shards, and registry traps;
- `docs/porting/REVIEW-HOWTO.md` with browser routes, ports, states, and evidence format;
- per-component evidence in `docs/porting/components/`;
- `/llms.txt`, `/llms-full.txt`, and Markdown documentation routes in the deployed site where the original site exposes equivalent agent-readable content.

## Acceptance criteria

The port is ready for its first public release only when:

- all 54 core components are implemented and exported;
- the `segmented-control` and `date-picker` compositions are documented and installable where the upstream site presents them;
- all 508 upstream examples have exactly one Svelte counterpart;
- every component and example task has fresh source-inspection evidence;
- every integrated component has parity/accessibility and Svelte-quality approval on the integrated commit;
- no unapproved deviation remains in the ledger;
- the full test, build, registry, browser, and accessibility gates pass from a clean checkout;
- a fresh user can install components through the shadcn-svelte CLI and build the resulting app;
- the docs use Svelte orange without changing installable component tokens;
- README and docs visibly credit COSS and Miel;
- license and third-party notices pass the release provenance review;
- `reference/`, `shardsui/`, worktrees, and review artifacts are absent from Git history.

## Planning split

Execution is divided into three plans:

1. repository, tooling, legal, test, registry, and CI foundation;
2. all component implementations and package-level parity review;
3. all documentation, examples, registry publication, and final site parity review.

Each plan defines dependency waves, exclusive ownership, concurrent implementation lanes, concurrent reviewers, integration gates, and lowercase commit subjects.
