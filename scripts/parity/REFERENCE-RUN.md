# Running the pinned React reference

The pinned COSS checkout cannot be installed with pnpm in place. Its root `package.json` declares another package manager, it has no `pnpm-workspace.yaml`, and `apps/ui` depends on `@coss/ui` through `workspace:*`.

The launcher copies the reference into an OS temporary directory. It writes the pnpm-only workspace files in that copy, installs the `ui` workspace and its dependencies with `--lockfile=false`, and starts the site on port 4000. It checks that the original `package.json` and lockfile remain byte-identical, then removes the temporary directory when the server stops.

```bash
COSS_REFERENCE_COMMAND="node scripts/parity/start-reference.mts" pnpm test:e2e --grep "preview harness"
```

The reference app is available at `http://127.0.0.1:4000/ui`; its Next.js `basePath` makes the bare port return a not-found page. The Svelte preview runs on port 4173. Do not run `pnpm install` inside `reference/`, and do not edit or regenerate the reference lockfile.
