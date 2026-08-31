# Contributing

COSS for Svelte accepts component fixes, parity corrections, tests, documentation, and repository
tooling. Accuracy matters more than change volume: a component is ready only when source, behavior,
styling, accessibility, examples, registry output, and visible docs agree with the pinned reference.

## Set up the workspace

Read these files before changing code:

- [AGENTS.md](AGENTS.md)
- [the port specification](docs/specs/2026-08-26-coss-svelte-port-spec.md)
- [the review procedure](docs/porting/REVIEW-HOWTO.md)
- [known porting pitfalls](docs/porting/PITFALLS.md)

Use Node.js 22.18 through 24 and pnpm 10.22.0.

```bash
corepack enable
pnpm install --frozen-lockfile
```

The repository expects a local `reference/` checkout at COSS commit
`19620ae8cae81e30775f2cde03829326cb4916b2` for provenance and parity checks. It also expects the
matching local `shardsui/` source when a change touches headless behavior. Both directories are
ignored and must never be committed.

## Choose the right issue

Use the parity template for a difference from COSS, the bug template for a reproducible port or docs
failure, and the feature template only for work outside current COSS parity. Report vulnerabilities
through [private vulnerability reporting](SECURITY.md).

Before starting a large component or API change, open an issue so its source boundary and expected
contract are reviewable.

## Change a component

For every affected component:

1. Read the complete COSS registry source and docs page under the permitted
   `reference/apps/ui/**` boundary.
2. Read every permitted particle that imports the component.
3. Inspect the matching Shards UI directory, documentation, tests, examples, and exported types.
4. Record the evidence in `docs/porting/components/<component>.md`.
5. Write a failing behavior test before the implementation.
6. Implement with current Svelte 5 patterns and preserve native attributes, accessibility, motion,
   and Svelte namespace composition.
7. Regenerate and verify registry output when public source changes.
8. Compare reference and port in the browser at matching themes, viewports, states, and reduced-motion
   settings.

Do not copy from `reference/packages/ui/**` or another AGPL-default path. If necessary evidence exists
only outside the permitted subtree, stop and record a licensing decision before using it.

## Code and docs conventions

- Use TypeScript, `$props()`, snippets, callback props, typed contexts, native attributes from
  `svelte/elements`, and `$props.id()` for generated IDs.
- Use `$bindable()` only for a deliberate two-way contract.
- Use `@/` for internal app and registry-authored imports. Uppercase registry placeholders such as
  `$LIB$` remain in generated transport documents so the installer can honor consumer aliases.
- Prefer compound Svelte composition such as `Card.Header`; do not write React-style consumer examples
  such as `CardHeader`.
- Prefer Tailwind utilities for ordinary layout, spacing, color, and responsive behavior. Keep custom
  CSS for selectors, keyframes, browser behavior, or geometry that utilities cannot express clearly.
- Add direct, project-specific prose. Avoid placeholder claims, future promises, and generic marketing
  copy.
- Do not hand-edit generated registry JSON under `apps/ui/static/r/`.

## Verify the change

Run focused tests while working. Before opening a pull request, run the full gate with no development
server left running:

```bash
pnpm verify
pnpm test
pnpm build
pnpm test:e2e
pnpm --filter @coss-sv/ui pack:check
pnpm --filter @coss-sv/docs registry:smoke
pnpm test:docs:e2e
node scripts/check-forbidden-paths.mjs
```

If a command produces browser traces, screenshots, or reports, keep them under ignored artifact paths
and attach only the useful failure evidence to the pull request.

## Open a pull request

Keep a branch focused and use lowercase Conventional Commit subjects:

```text
feat(packages/ui): add accordion
docs(apps/ui): port accordion examples
fix(apps/ui): align preview spacing
chore(repo): pin ci actions
```

Complete the pull request template with exact source paths, commands, routes, measurements, and
review evidence. A component change needs parity and accessibility review plus Svelte-quality review
on the final commit. A code change after approval invalidates the affected review.

Maintainers merge through a pull request after required CI and CodeQL checks pass, review threads are
resolved, and the branch is current. Direct pushes, force pushes, and branch deletion are blocked on
`main`.
