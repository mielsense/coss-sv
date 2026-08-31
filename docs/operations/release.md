# Release and deployment policy

This repository has two delivery surfaces: the documentation and registry site, and the
`@coss-sv/ui` workspace package. They do not share a release switch.

## Documentation and registry

Vercel builds `apps/ui` through the repository configuration. A production deployment must use Node
22.18 or newer within the supported Node 22–24 range and install with the committed pnpm lockfile.

Before promoting a deployment, run:

```bash
pnpm verify
pnpm test
pnpm build
pnpm test:e2e
pnpm --filter @coss-sv/ui pack:check
pnpm --filter @coss-sv/docs registry:smoke
pnpm test:docs:e2e
```

Then check these production routes:

- `/docs`
- `/particles`
- `/r/button.json`
- `/llms.txt`
- `/skill.md`
- `/.well-known/agent-skills/index.json`

Registry JSON is generated from authored source. A change is incomplete if generation leaves a diff
or a clean consumer installation fails.

## Package publication

`@coss-sv/ui` remains at `0.0.0` and is not published as a stable npm package. Registry installation
is the supported public path until package naming, ownership, versioning, and release credentials are
confirmed.

Do not add an npm token, provenance permission, or automatic publish job before those decisions are
recorded. When package publication is approved, the release must:

1. use npm trusted publishing or a short-lived environment credential;
2. build from a protected tag or GitHub release;
3. run `pnpm --filter @coss-sv/ui pack:check` before publication;
4. verify the tarball contains no tests, fixtures, private aliases, or local source boundaries;
5. publish with npm provenance and least-privilege workflow permissions;
6. create release notes that identify user-visible component, API, registry, and accessibility
   changes.

## Rollback

Roll back a bad site deployment through Vercel's immutable deployment history. Never repair generated
registry files directly in production.

For a future npm release, deprecate a bad version and publish a corrected patch. Do not delete a
published version unless npm security support requires it; deletion breaks lockfiles and cached
registry installs.
