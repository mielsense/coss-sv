# Contributing

Thank you for helping with COSS for Svelte. The port values accuracy over volume. A component is not done until its source, behavior, styling, accessibility, tests, and examples agree with the reference.

## Before you begin

Read:

- [AGENTS.md](AGENTS.md)
- [the port specification](docs/specs/2026-08-26-coss-svelte-port-spec.md)
- [the review procedure](docs/porting/REVIEW-HOWTO.md)
- [the known pitfalls](docs/porting/PITFALLS.md)

Use Node.js 22.18 through 24 and pnpm 10.22.0.

```bash
corepack enable
pnpm install
```

## Component changes

Every component change must identify the exact files read under `reference/apps/ui/**` and the exact Shards source and documentation inspected. Copying from `reference/packages/ui/**` is not allowed.

Write failing behavior tests before the implementation. Compare the React reference and Svelte result in the browser at matching viewports and themes. Interactive components need keyboard, focus, reduced-motion, and accessibility checks.

Record any intentional mismatch in `docs/porting/DEVIATIONS.md` and obtain approval before merge. Silent deviations are bugs.

## Pull requests

Run the relevant focused tests, then the full gate:

```bash
pnpm verify
pnpm test
pnpm build
```

Use lowercase Conventional Commit subjects:

```text
feat(packages/ui): add accordion
docs(apps/ui): port accordion examples
fix(apps/ui): align preview spacing
```

A pull request needs independent parity and Svelte-quality reviews on the final commit.

