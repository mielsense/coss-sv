# Registry foundation evidence

The registry pipeline targets `shadcn-svelte` 1.5.0. The version and command flags came from a fresh
`pnpm dlx shadcn-svelte@latest` check on 2026-08-27.

Context7 had no remaining monthly requests during this task. The fallback sources were the official
shadcn-svelte registry, registry schema, registry item schema, `components.json`, and CLI pages. The
local Shards UI checkout has no shadcn registry authoring files. Its package metadata confirms the
Svelte 5 package name and dependency boundary used by future COSS registry items.

The production manifests stay empty until reviewed COSS components and examples land. The smoke test
creates private leaf, compound, overlay, hook, CSS variable, dependency, and `local:` bundle items in a
temporary directory. A fresh consumer installs the bundle first, so every dependency file must arrive
through `local:` URLs. Child processes use temporary home, profile, cache, config, and pnpm store paths.
The script confirms cleanup after the install and build checks.
