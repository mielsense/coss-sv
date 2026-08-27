# Running the pinned React reference

The pinned COSS checkout cannot be installed with pnpm in place. Its root `package.json` declares another package manager, it has no `pnpm-workspace.yaml`, and `apps/ui` depends on `@coss/ui` through `workspace:*`.

The launcher copies the reference into an OS temporary directory. It parses the pinned `bun.lock` without running Bun, converts every package record into an exact pnpm override, and writes a temporary `pnpm-lock.yaml`. The install then runs with `--frozen-lockfile`. The launcher fails if the frozen install changes that lockfile.

The original `package.json` and `bun.lock` must remain byte-identical. The launcher checks both files before it removes the temporary directory.

```bash
pnpm test:e2e --grep "preview harness"
```

Playwright uses the launcher by default. CI may set `COSS_REFERENCE_COMMAND` to another pnpm-only command when its checkout layout requires one.

The reference app is available at `http://127.0.0.1:4000/ui`; its Next.js `basePath` makes the bare port return a not-found page. The Svelte preview runs on port 4173. Do not run `pnpm install` inside `reference/`, and do not edit or regenerate the reference lockfile.
