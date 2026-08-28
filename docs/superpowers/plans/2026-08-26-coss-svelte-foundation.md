# COSS for Svelte Repository Foundation Plan

> This plan uses the project-specific parallel-agent protocol in the port specification. It does not use the Superpowers subagent-driven-development skill.

**Goal:** Create the pnpm monorepo, legal boundary, Svelte 5 package and documentation shells, test infrastructure, shadcn-svelte registry pipeline, and GitHub delivery configuration required before component work begins.

**Architecture:** `packages/ui` is the canonical installable component package. `apps/ui` is a SvelteKit documentation and registry host. Root tooling coordinates both with pnpm and Turbo. Generated registry JSON is served from `apps/ui/static/r`, while local reference repositories remain ignored comparison inputs.

**Baseline:** Node.js 22.18 through 24, pnpm 10.22.0, Svelte 5.56.10, SvelteKit 2.70.3, Vite 8.2.2, TypeScript 6.0.3, Tailwind CSS 4.3.3, Biome 2.5.10, Vitest 4.1.11, Playwright 1.62.1, the published Shards UI 0.1.0-beta.0 with a compatibility gate for the local 0.1.0-beta.1 source, and the current shadcn-svelte CLI resolved during setup.

**Specification:** `docs/specs/2026-08-26-coss-svelte-port-spec.md`

## Parallel execution rules

The coordinator owns these shared files for the entire plan:

- `pnpm-lock.yaml`
- root `package.json`
- root `turbo.json`
- root `biome.json`
- root aggregate CI results

Implementation agents work in isolated worktrees and receive exclusive ownership of the paths listed in their task. They do not edit coordinator-owned files. When they need a root dependency or script, they add the exact request to their handoff.

The current runtime supports the coordinator plus three workers. Before review starts, fill all three worker slots with independent implementation lanes. After the first handoff, use two workers for its independent reviews and keep one implementation lane running. Rotate slots immediately when a review, fix, or implementation finishes.

Each implementation commit receives two reviews in parallel:

- a foundation correctness reviewer checks the specification, source provenance, commands, and resulting behavior;
- a Svelte/tooling reviewer checks current Svelte, SvelteKit, TypeScript, Biome, pnpm, and package patterns.

Review begins as soon as a lane commits. Other implementation lanes continue while review is running. The coordinator integrates only the commit approved by both reviewers.

## Dependency waves

```text
F0 provenance and ownership lock
└── F1 root workspace
    ├── F2 shared TypeScript package ─┐
    ├── F3 UI package shell ─────────┼── F5 test and parity harness ─┐
    └── F4 docs app shell ───────────┤                            │
                                     ├── F6 registry pipeline ─────┼── F8 integration gate
F0 ──────────────────────────────────└── F7 legal and GitHub setup ┘
```

F2, F3, and F4 start together after F1. F5 and F6 start when their specific prerequisites are integrated. F7 can start after F0 and run alongside application work.

## Task F0: Lock provenance, exclusions, and the agent contract

**Owner:** coordinator
**Files:** `.gitignore`, `.gitattributes`, `.npmrc`, `.nvmrc`, `AGENTS.md`, `docs/porting/DEVIATIONS.md`, `docs/porting/PITFALLS.md`, `docs/porting/REVIEW-HOWTO.md`, `docs/porting/PARITY-MATRIX.md`

### Step 1: Capture immutable source facts

Run:

```bash
git -C reference rev-parse HEAD
git -C shardsui rev-parse HEAD
git -C reference status --short
git -C shardsui status --short
```

Expected source revisions:

```text
reference: 19620ae8cae81e30775f2cde03829326cb4916b2
shardsui: f8b134dfa627cbe3da7e538e2531b0b9fce4d48e
```

If either working tree has changes or the revision differs, record the actual revision before any port task. Do not mutate either reference.

### Step 2: Write the failing forbidden-path check

Create `scripts/check-forbidden-paths.mjs`. It exits non-zero if `git ls-files` contains any path beginning with:

```text
reference/
shardsui/
.worktrees/
artifacts/
playwright-report/
test-results/
```

Run before adding ignore rules:

```bash
node scripts/check-forbidden-paths.mjs
```

Expected: the script is executable and reports a clear error if a fixture path is temporarily passed to its exported validation function. Unit-test the pure validator in `scripts/check-forbidden-paths.test.ts`; do not add forbidden paths to Git just to test it.

### Step 3: Add exclusions and repository defaults

`.gitignore` must include the two local reference directories, worktrees, review artifacts, build output, package caches, environment files, Vercel state, coverage, and editor files. `.npmrc` must set:

```ini
engine-strict=true
manage-package-manager-versions=true
prefer-workspace-packages=true
strict-peer-dependencies=true
```

Set `.nvmrc` to `22.18.0`. Normalize text files to LF in `.gitattributes`.

### Step 4: Write the repository agent contract

`AGENTS.md` must state:

- `reference/apps/ui/**` is the only COSS code/content source;
- agents must freshly inspect the specific COSS and Shards files for every component or example task;
- reference summaries never replace direct inspection;
- exclusive file ownership and coordinator-owned file rules;
- current Svelte 5 requirements and prohibited legacy syntax;
- mandatory tests and both independent reviews;
- exact lowercase commit subject format;
- commands for check, test, build, registry, and parity review;
- no commits from `reference/`, `shardsui/`, `.worktrees/`, or review output.

### Step 5: Seed porting ledgers

Create concise documents with stable schemas:

- `DEVIATIONS.md`: component, upstream behavior, port behavior, reason, approval, tests.
- `PITFALLS.md`: symptom, cause, safe pattern, affected components.
- `REVIEW-HOWTO.md`: port allocation, reference and target commands, route format, state matrix, evidence format.
- `PARITY-MATRIX.md`: generated section markers plus a human summary. The generated rows arrive in F5.

Initial deviations must say `None`.

### Step 6: Verify and commit

Run:

```bash
node scripts/check-forbidden-paths.mjs
git check-ignore reference shardsui .worktrees artifacts
git diff --check
```

Commit:

```text
chore(repo): define porting and provenance rules
```

## Task F1: Configure the root pnpm and Turbo workspace

**Owner:** coordinator
**Files:** `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `biome.json`, `scripts/check-workspace.mjs`, `pnpm-lock.yaml`

### Step 1: Write the failing workspace validation

Create `scripts/check-workspace.mjs` to assert:

- `packageManager` is exactly `pnpm@10.22.0`;
- `engines.node` is `>=22.18 <25`;
- the only workspace globs are `apps/*` and `packages/*`;
- Bun and npm lockfiles are absent;
- required root scripts exist;
- Turbo tasks declare their output directories.

Run:

```bash
node scripts/check-workspace.mjs
```

Expected: failure because the root manifests do not exist.

### Step 2: Create root manifests

The root `package.json` is private and exposes:

```json
{
  "scripts": {
    "build": "turbo run build",
    "check": "turbo run check",
    "ci": "pnpm verify && pnpm test && pnpm build",
    "dev": "turbo run dev --parallel",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "lint": "biome lint .",
    "registry:build": "pnpm --filter @coss-sv/docs registry:build",
    "registry:check": "pnpm --filter @coss-sv/docs registry:check",
    "test": "turbo run test",
    "test:e2e": "pnpm --filter @coss-sv/docs test:e2e",
    "verify": "pnpm format:check && pnpm lint && pnpm check && pnpm registry:check"
  }
}
```

Use pnpm catalogs in `pnpm-workspace.yaml` for the shared Svelte, SvelteKit, Vite, TypeScript, Vitest, and Tailwind versions. Packages refer to catalog entries rather than duplicating version ranges.

Configure Turbo tasks for `build`, `check`, `test`, `dev`, and `registry:build`. `dev` is persistent and uncached. Build outputs include `.svelte-kit/**`, `build/**`, `dist/**`, and `static/r/**` only in the relevant packages.

### Step 3: Configure Biome for Svelte

`biome.json` must:

- use schema version 2.5.10;
- enable formatter and recommended lints;
- enable VCS integration;
- enable `html.experimentalFullSupportEnabled` for Svelte files;
- use spaces with two-space indentation and 100-character line width;
- use double quotes in JavaScript and TypeScript;
- ignore generated registry JSON, build output, references, worktrees, and review artifacts;
- enable Svelte-specific rules supported by the selected Biome version, including rejection of legacy `{@const}` where applicable.

Do not add ESLint or Prettier.

### Step 4: Install and lock

Add exact root dev dependencies for Turbo and Biome. Run:

```bash
corepack enable
pnpm install
node scripts/check-workspace.mjs
pnpm exec biome check biome.json package.json pnpm-workspace.yaml turbo.json
```

Expected: install succeeds with a single `pnpm-lock.yaml`, validation passes, and Biome reports no errors.

### Step 5: Commit

```text
chore(repo): configure pnpm workspace
```

## Task F2: Add shared TypeScript configurations

**Can run with:** F3 and F4
**Exclusive files:** `packages/typescript-config/**`

### Step 1: Create contract fixtures

Create `packages/typescript-config/tests/base/tsconfig.json`, `tests/svelte-library/tsconfig.json`, and `tests/sveltekit/tsconfig.json`. Each extends the matching published config and includes a minimal file that requires strict type checking.

The base negative fixture must prove `noUncheckedIndexedAccess` is active. The library fixture must resolve `.svelte` declarations. The SvelteKit fixture must preserve generated Kit types.

Run the fixture script before the configs exist:

```bash
pnpm --dir packages/typescript-config test
```

Expected: failure due to missing shared configurations.

### Step 2: Implement the package

Create:

```text
packages/typescript-config/package.json
packages/typescript-config/base.json
packages/typescript-config/svelte-library.json
packages/typescript-config/sveltekit.json
packages/typescript-config/tests/**
```

`base.json` uses strict TypeScript 6 settings, `verbatimModuleSyntax`, `isolatedModules`, `moduleResolution: bundler`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and no emit.

`svelte-library.json` extends base and adds Svelte library includes and declaration-safe settings. `sveltekit.json` extends the generated `.svelte-kit/tsconfig.json` at the consuming app level and adds only compatible strictness.

Export each JSON file explicitly from the package manifest. Package name: `@coss-sv/typescript-config`. License: MIT.

### Step 3: Verify

Run:

```bash
pnpm --dir packages/typescript-config test
pnpm exec biome check packages/typescript-config
```

Expected: positive fixtures pass and deliberately annotated negative fixtures fail only where expected.

### Step 4: Commit

```text
feat(packages/typescript-config): add strict svelte configs
```

## Task F3: Scaffold the canonical UI package

**Can run with:** F2 and F4
**Exclusive files:** `packages/ui/**`

### Step 1: Write package-surface tests first

Create tests that initially fail for:

- importing `@coss-sv/ui/lib/utils`;
- importing `@coss-sv/ui/styles/globals.css`;
- packaging `.svelte` components with declarations;
- rendering a typed native wrapper through SSR and browser projects;
- rejecting legacy Svelte syntax with a source scan.

Do not implement a real COSS component in this task. Use a private `_fixture` component that will be removed before F3 is committed.

### Step 2: Create the Svelte package

Create:

```text
packages/ui/package.json
packages/ui/svelte.config.js
packages/ui/vite.config.ts
packages/ui/tsconfig.json
packages/ui/src/index.ts
packages/ui/src/lib/utils.ts
packages/ui/src/styles/globals.css
packages/ui/src/components/ui/.gitkeep
packages/ui/src/hooks/.gitkeep
packages/ui/tests/**
```

The package must:

- use `@sveltejs/package` for build output;
- publish Svelte source declarations and CSS through explicit exports;
- set `svelte` as a peer dependency;
- pin `@shardsui/svelte` exactly and expose no React dependency;
- use `clsx` and `tailwind-merge` for a typed `cn()` helper;
- mark CSS as a side effect;
- provide `check`, `test`, `build`, and `pack:check` scripts;
- extend `@coss-sv/typescript-config/svelte-library.json` after F2 is integrated.

Global styles establish the unchanged COSS component token names in light and dark mode. Do not apply Svelte orange to package tokens.

### Step 3: Validate package output

Run:

```bash
pnpm --filter @coss-sv/ui check
pnpm --filter @coss-sv/ui test
pnpm --filter @coss-sv/ui build
pnpm --filter @coss-sv/ui pack:check
```

`pack:check` must inspect `pnpm pack --dry-run --json` and fail if tests, fixtures, reference files, worktrees, or undeclared source paths would publish.

### Step 4: Commit

```text
feat(packages/ui): scaffold svelte component package
```

## Task F4: Scaffold the SvelteKit documentation app

**Can run with:** F2 and F3
**Exclusive files:** `apps/ui/**` except `apps/ui/registry/**`, `apps/ui/static/r/**`, and registry scripts reserved for F6

### Step 1: Write route and theme tests first

Add failing tests for:

- the home route renders a project title and Miel attribution;
- the credits route links to COSS, Miel, and local legal files;
- documentation chrome exposes `--site-primary: #ff3e00`;
- the preview layout does not inherit `--site-primary` as the installable component `--primary` token;
- `/preview/_health` renders without documentation chrome and exposes a readiness marker;
- SSR output contains no hydration-only placeholder for the main navigation.

### Step 2: Create the app shell

Create a stable SvelteKit app with:

```text
apps/ui/package.json
apps/ui/svelte.config.js
apps/ui/vite.config.ts
apps/ui/tsconfig.json
apps/ui/src/app.css
apps/ui/src/app.d.ts
apps/ui/src/lib/site/**
apps/ui/src/routes/+layout.svelte
apps/ui/src/routes/+page.svelte
apps/ui/src/routes/credits/+page.svelte
apps/ui/src/routes/preview/+layout.svelte
apps/ui/src/routes/preview/_health/+page.svelte
apps/ui/static/**
```

Use mdsvex for authored documentation and Shiki for code rendering, matching the proven evilcharts-svelte setup where it remains current. Use `@sveltejs/adapter-vercel` for production output. Do not introduce an experimental SvelteKit feature flag.

The app package name is `@coss-sv/docs`. It depends on `@coss-sv/ui` through `workspace:*` and extends the shared SvelteKit TypeScript config after F2 lands.

The visible shell must say “COSS for Svelte” and include a restrained “Unofficial Svelte port made by Miel” attribution. The initial shell may establish routing and test infrastructure, but it is not a visually acceptable deliverable: the COSS homepage and shared chrome must be ported from the inspected upstream files before foundation sign-off. The attribution must not replace the upstream hero, category grid, or documentation structure.

### Step 3: Isolate documentation color

Define `--site-primary: #ff3e00` in the docs shell. Keep package component variables separate. The preview layout imports COSS package styles, resets its canvas background, and omits the docs chrome stylesheet where possible.

### Step 4: Verify

Run:

```bash
pnpm --filter @coss-sv/docs check
pnpm --filter @coss-sv/docs test
pnpm --filter @coss-sv/docs build
```

Start the built app and inspect `/`, `/credits`, and `/preview/_health` in the in-app browser at desktop and narrow widths.

### Step 5: Commit

```text
feat(apps/ui): scaffold sveltekit documentation app
```

## Task F5: Build the shared test and parity harness

**Prerequisites:** F3 and F4
**Exclusive files:** `vitest.workspace.ts`, `playwright.config.ts`, `tests/**`, `scripts/parity/**`, `apps/ui/src/routes/preview/[name]/**`, generated section of `docs/porting/PARITY-MATRIX.md`

### Step 1: Inventory the upstream inputs

Write `scripts/parity/inventory.mts` to derive, never hand-maintain:

- 54 registry component names from `reference/apps/ui/registry/default/ui/*.tsx`;
- every component documentation slug;
- all 508 particle identifiers from `reference/apps/ui/registry/default/particles/*.tsx`;
- imports that map each particle to one or more components.

The script writes a normalized JSON artifact under a temporary or ignored artifact directory and updates only the generated section in `PARITY-MATRIX.md`.

### Step 2: Write failing parity tests

Create tests that compare the reference inventory with target manifests. At foundation time, expected failures must list the 54 missing components and 508 missing particles without truncation.

The test API is:

```ts
type ParityEntry = {
  id: string;
  kind: "component" | "particle" | "doc";
  sourcePaths: string[];
  targetPaths: string[];
  status: "missing" | "implemented" | "reviewed" | "approved";
};
```

Support a checked-in, explicit baseline status file without allowing it to hide inventory mismatches.

### Step 3: Configure Vitest projects

Create node and browser projects. Browser tests use Playwright Chromium. Component tests use `@testing-library/svelte`. Add wrapper fixtures for snippets, bindings, contexts, and SSR hydration.

### Step 4: Configure browser comparison

`playwright.config.ts` defines:

- a React reference web server on port `4000` using `pnpm` only if the upstream app supports it; otherwise document the one-time compatible reference command without modifying the reference lockfile;
- a Svelte preview server on port `4173`;
- light and dark projects;
- deterministic locale, timezone, reduced animation for static captures, and a separate motion project;
- screenshot, trace, DOM snapshot, axe, console, and computed-style helpers.

Add `/preview/[name]` with a typed lookup registry and a visible error for unknown names. F5 provides the renderer and `_health`; Plan 3 supplies all particle modules.

### Step 5: Verify the harness

Use `_health` and one private fixture to prove:

- both servers start;
- the readiness marker works;
- screenshots and computed style snapshots are captured;
- keyboard events reach the page;
- console errors fail the test;
- axe findings fail the test;
- missing parity entries remain reported as planned work, not a false green build.

Run:

```bash
pnpm test
pnpm test:e2e --grep "preview harness"
pnpm exec tsx scripts/parity/inventory.mts --check
```

### Step 6: Commit

```text
test(repo): add component parity harness
```

## Task F6: Implement the shadcn-svelte registry pipeline

**Prerequisites:** F3 and F4
**Exclusive files:** `apps/ui/registry/**`, `apps/ui/scripts/registry/**`, `apps/ui/registry.json`, `apps/ui/static/r/**`, `apps/ui/tests/registry/**`

### Step 1: Fetch current CLI guidance

Use Context7 for current shadcn-svelte registry and CLI documentation. If Context7 is unavailable, use only the official shadcn-svelte registry and CLI pages and record the fallback in the task evidence.

Resolve the current CLI once:

```bash
pnpm dlx shadcn-svelte@latest --version
```

Add that exact resolved version to `apps/ui` dev dependencies. Subsequent scripts invoke the local binary with `pnpm exec shadcn-svelte`.

### Step 2: Write failing schema and freshness tests

Tests must reject:

- an unknown registry type;
- a source file outside the allowed roots;
- a React or Base UI dependency;
- a file destination outside configured component aliases;
- a missing dependency item;
- stale generated JSON;
- a registry file that resolves to `reference/` or `shardsui/`.

### Step 3: Implement typed manifests and generator

Create:

```text
apps/ui/registry/registry-ui.ts
apps/ui/registry/registry-particles.ts
apps/ui/registry/registry.ts
apps/ui/scripts/registry/generate.mts
apps/ui/scripts/registry/check.mts
apps/ui/scripts/registry/smoke-install.mts
apps/ui/registry.json
apps/ui/static/r/**
```

At foundation time, include private fixture items that exercise:

- a single Svelte component;
- a compound component with multiple files;
- CSS variables and dependencies;
- a registry dependency using `local:`.

Remove the private items before commit and leave valid empty typed manifests ready for Plan 2 and Plan 3.

The build sequence is:

```bash
pnpm --filter @coss-sv/docs registry:generate
pnpm --filter @coss-sv/docs exec shadcn-svelte registry build registry.json -o static/r
pnpm --filter @coss-sv/docs registry:check
```

### Step 4: Implement an installation fixture

Create a temporary SvelteKit fixture using pnpm. Initialize shadcn-svelte non-interactively with a checked-in `components.json` template, install the private fixture registry item through a local HTTP server, then run `svelte-check` and `vite build`.

The smoke script must always clean its temporary directory and terminate its server. It must never write into the user home directory.

### Step 5: Verify and commit

Run:

```bash
pnpm --filter @coss-sv/docs registry:build
pnpm --filter @coss-sv/docs registry:check
pnpm --filter @coss-sv/docs registry:smoke
```

Commit:

```text
feat(apps/ui): add shadcn svelte registry pipeline
```

## Task F7: Add legal, community, CI, and deployment files

**Can run with:** F2 through F6
**Exclusive files:** `LICENSE`, `NOTICE.md`, `THIRD_PARTY_NOTICES.md`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `.github/**`, `apps/ui/vercel.json`

### Step 1: Verify the license boundary again

Freshly read:

```text
reference/LICENSE
reference/LICENSING.md
reference/apps/ui/package.json
reference/apps/ui/scripts/sync-ui.mts
shardsui/packages/shardsui/LICENSE
```

Compare every planned adapted path with the `reference/apps/ui/**` boundary. Record the exact reference and Shards revisions in `NOTICE.md`.

### Step 2: Add legal documents

- `LICENSE`: standard MIT license for the port, with Miel's port copyright and no reassignment of upstream rights.
- `NOTICE.md`: COSS URL, pinned commit, MIT source subtree, nature of the Svelte modifications, no-endorsement statement, and Miel link.
- `THIRD_PARTY_NOTICES.md`: Shards UI notice including its Base UI and Floating UI attributions, plus sections for Hugeicons, fonts, and any calendar dependency actually selected. UI icons use the free Hugeicons packages exclusively.

Run a path-to-license script that fails if an adapted source evidence file points outside `reference/apps/ui/**`.

### Step 3: Write community documents

Write direct, project-specific copy. Pass every file through the Unslop checklist. README must include:

- one-sentence project description;
- current development-status warning;
- pnpm-only setup;
- documentation and registry commands;
- the unofficial-port and Miel credit;
- COSS credit and license links;
- contribution and security links.

Do not claim production readiness before the final acceptance gate.

### Step 4: Add GitHub configuration

Create:

```text
.github/workflows/ci.yml
.github/workflows/codeql.yml
.github/dependabot.yml
.github/ISSUE_TEMPLATE/bug.yml
.github/ISSUE_TEMPLATE/parity.yml
.github/ISSUE_TEMPLATE/feature.yml
.github/pull_request_template.md
```

CI runs frozen install, forbidden-path validation, provenance validation, Biome, Svelte checks, tests, builds, registry freshness, registry installation smoke, and affected browser tests. Use pnpm caching through `actions/setup-node` and pin action versions consistently. Grant only read permissions unless a job demonstrably needs more.

CodeQL scans JavaScript and TypeScript. Dependabot updates pnpm and GitHub Actions weekly with grouped development dependencies.

The pull request template asks for exact source files inspected, component/example IDs, both review links, light/dark and keyboard evidence, license boundary confirmation, and commands run.

### Step 5: Add Vercel configuration

Configure the Vercel project with `apps/ui` as its Root Directory and without embedding a team or project ID. Document:

```text
install: pnpm install --frozen-lockfile
build: pnpm build
framework preset: SvelteKit
output: produced by @sveltejs/adapter-vercel
```

Do not override the output directory in Vercel. `apps/ui/vercel.json` is limited to registry response headers and redirects that are covered by tests.

Do not enable package publication or create a GitHub release in this task.

### Step 6: Verify and commit

Run the legal check, a GitHub Actions syntax check available in the toolchain, and:

```bash
pnpm format:check
pnpm lint
git diff --check
```

Commit:

```text
chore(repo): add legal and github configuration
```

## Task F8: Integrate and prove the foundation

**Owner:** coordinator
**Prerequisites:** approved F0 through F7
**Files:** coordinator-owned manifests and lockfile; only integration fixes elsewhere

### Step 1: Integrate in dependency order

Cherry-pick approved commits in this order:

1. F0
2. F1
3. F2
4. F3 and F4 in either order
5. F5 and F6 in either order
6. F7

Resolve shared dependency requests only in the root workspace. Regenerate `pnpm-lock.yaml` once after all package manifests are integrated.

### Step 2: Run the clean-checkout gate

From a fresh integration worktree:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm verify
pnpm test
pnpm build
pnpm --filter @coss-sv/docs registry:smoke
pnpm test:e2e --grep "preview harness"
node scripts/check-forbidden-paths.mjs
git diff --exit-code
```

Expected:

- every command exits zero;
- the package tarball contains only intended files;
- the docs home, credits, and health preview render in the in-app browser;
- the docs brand uses `#ff3e00` and the preview component tokens do not;
- parity inventory truthfully reports component and example work as incomplete;
- no generated or reference file appears as an uncommitted change.

### Step 3: Run integration reviews concurrently

One reviewer audits the entire foundation against the specification and legal boundary. A second reviewer recreates setup from a fresh clone-like worktree and follows only README instructions. Fix every finding and rerun the relevant reviewer.

### Step 4: Commit integration-only fixes

Use one of:

```text
fix(repo): correct foundation integration
docs(repo): clarify local development setup
```

The plan is complete when both integration reviewers approve the same HEAD and the clean-checkout gate passes.
