# COSS for Svelte agent guide

## Mission

Build an unofficial, high-fidelity Svelte 5 port of the COSS component library and documentation. Rendered styling, behavior, accessibility, examples, and visible copy must match the pinned COSS reference. Implementation must use current, stable Svelte 5 patterns and Shards UI primitives.

Read `docs/specs/2026-08-26-coss-svelte-port-spec.md` and the active plan before changing code.

## Source boundary

- Adapt COSS code and content only from the MIT-designated `reference/apps/ui/**` subtree.
- Never copy from `reference/packages/ui/**` or another AGPL-default path.
- Read the actual source files for every task. Summaries and memory are not source evidence.
- Read the matching local Shards implementation and documentation under `shardsui/` before writing a behavioral primitive.
- Do not modify, stage, or commit `reference/` or `shardsui/`.
- Do not commit `.worktrees/`, `artifacts/`, browser profiles, screenshots, traces, or test reports.

If required source exists only outside `reference/apps/ui/**`, stop the affected task and record a licensing decision before using it.

## Per-component inspection

Before implementing a component:

1. Read its complete COSS registry source.
2. Read its complete COSS documentation page when present.
3. Find and read every particle that imports it.
4. Run the upstream examples and inspect their DOM, computed styles, states, keyboard behavior, focus, motion, and responsive layout.
5. Read the complete matching Shards component directory, documentation, tests, examples, and exported types.
6. Write the evidence record in `docs/porting/components/<component>.md`.
7. Write failing behavior tests before implementation.

Review agents repeat the source inspection. They do not accept the implementation agent's notes as a substitute.

## Svelte standard

Target Svelte 5.56 or newer stable Svelte 5 and SvelteKit 2.70 or newer stable Kit 2.

- Use TypeScript.
- Use `$props()`, snippets, callback props, `$derived`, and typed `createContext` helpers.
- Use `$bindable()` only for deliberate two-way contracts.
- Use `$props.id()` for hydration-stable generated IDs.
- Use typed native attributes from `svelte/elements` and forward remaining props.
- Prefer attachments for new composable DOM behavior.
- Use declaration tags instead of legacy `{@const}`.
- Keep per-user mutable state out of shared server module scope.
- Keep `load` functions free of writes and side effects.

Do not introduce `export let`, `$:`, `on:`, `<slot>`, `createEventDispatcher`, `<svelte:component>`, deprecated component class types, or mixed Svelte generations in new code. Do not enable experimental Svelte or SvelteKit flags without an approved decision record.

Before changing Svelte code, read the relevant Svelte Edge reference files. After changing it, run `pnpm check` plus focused tests and browser coverage.

## Parallel ownership

- Every implementation lane works in an isolated Git worktree.
- The coordinator assigns exact exclusive paths.
- Only the coordinator edits root manifests, the lockfile, aggregate exports, aggregate registry manifests, shared navigation indexes, and generated parity indexes.
- If a lane needs a shared edit, request it in the handoff instead of editing the shared file.
- Both the parity/accessibility reviewer and Svelte-quality reviewer must approve the exact commit before integration.
- A post-review change invalidates the affected approval.

## Required commands

```bash
pnpm format:check
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm registry:check
node scripts/check-forbidden-paths.mjs
```

Run focused package and Playwright commands from the active plan before the full gate exists.

## Commit subjects

Use lowercase Conventional Commits with a precise scope:

```text
chore(repo): configure pnpm workspace
feat(packages/ui): add accordion
test(packages/ui): cover accordion interactions
docs(apps/ui): port accordion examples
fix(apps/ui): align preview spacing
```

## Writing

Use direct, project-specific prose. Apply the Unslop checklist to README, documentation, contribution text, issue templates, and release notes before review.

