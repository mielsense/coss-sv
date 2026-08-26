# COSS for Svelte

COSS for Svelte is an unofficial Svelte 5 port of [COSS UI](https://github.com/cosscom/coss). The work is in progress. Components and registry items are not ready for application use yet.

The project keeps COSS styling and interaction behavior while replacing React and Base UI with Svelte 5 and Shards UI. The repository contains the component package and its SvelteKit documentation site.

## Repository layout

```text
apps/ui/                    SvelteKit documentation and registry host
packages/ui/                installable Svelte component source
packages/typescript-config/ shared TypeScript settings
```

The local `reference/` and `shardsui/` directories are comparison inputs. Git ignores them, and they are never published.

## Local setup

Requirements:

- Node.js 22.18 through 24
- pnpm 10.22.0

```bash
corepack enable
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm format:check
pnpm lint
pnpm check
pnpm test
pnpm build
```

The documentation registry will use the shadcn-svelte CLI. Install commands will be documented once the first reviewed component batch is available.

## Attribution and license

This port was made by [Miel](https://github.com/mielsense). COSS and its contributors own the original work. This project is not endorsed by COSS.

The port adapts only the MIT-designated `apps/ui/` subtree of COSS. Read [NOTICE.md](NOTICE.md), [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), and [LICENSE](LICENSE) before redistributing it.

## Contributing

Component work requires a fresh comparison with the pinned COSS and Shards sources, behavior tests, browser evidence, and two independent reviews. [CONTRIBUTING.md](CONTRIBUTING.md) explains the workflow.

