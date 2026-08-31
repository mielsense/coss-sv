# COSS for Svelte

[![CI](https://github.com/mielsense/coss-sv/actions/workflows/ci.yml/badge.svg)](https://github.com/mielsense/coss-sv/actions/workflows/ci.yml)
[![CodeQL](https://github.com/mielsense/coss-sv/actions/workflows/codeql.yml/badge.svg)](https://github.com/mielsense/coss-sv/actions/workflows/codeql.yml)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-ff3e00?logo=svelte&logoColor=white)](https://svelte.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-111111.svg)](LICENSE)

COSS for Svelte is an unofficial, high-fidelity Svelte 5 port of [COSS
UI](https://github.com/cosscom/coss). It ships the complete component catalog, all 508 upstream
particles, a shadcn-svelte registry, and a matching SvelteKit documentation site.

The port keeps the COSS visual language, spacing, motion, examples, and interaction details while
replacing React and Base UI with Svelte 5 and [Shards UI](https://github.com/abdrizik/shardsui).

[Read the documentation](https://coss-sv.vercel.app/docs) · [Browse the
components](https://coss-sv.vercel.app/docs/components/accordion) · [Explore the
particles](https://coss-sv.vercel.app/particles)

## Install a component

Use the command shown on the exact component page. Registry installation is the public delivery path
for the current pre-release:

```bash
pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/card.json
```

The registry installs source into your application and resolves imports through the alias in your
`components.json`. The documentation uses `@/`:

```svelte
<script lang="ts">
  import * as Card from "@/components/ui/card/index.js";
  import { Button } from "@/components/ui/button/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Account</Card.Title>
    <Card.Description>Manage your account settings.</Card.Description>
  </Card.Header>
  <Card.Content>...</Card.Content>
  <Card.Footer>
    <Button>Save changes</Button>
  </Card.Footer>
</Card.Root>
```

Compound components use Svelte namespace syntax such as `Card.Header`, `Dialog.Popup`, and
`InputGroup.Addon`. Each component page documents the available parts, props, states, dependencies,
and particle examples.

`@coss-sv/ui` is built and tested as a workspace package, but no stable npm release is published yet.
Do not depend on the `0.0.0` workspace version outside this repository.

## Install the agent skill

The repository includes a portable skill for coding agents:

```bash
npx skills add mielsense/coss-sv --skill coss-svelte
```

It teaches agents the registry workflow, component catalog, Svelte composition rules, COSS and
Shards boundary, accessibility requirements, and debugging order. Read the [Agent Skill
guide](https://coss-sv.vercel.app/docs/skills) or the published
[`SKILL.md`](https://coss-sv.vercel.app/skill.md).

Agents without an installed skill can use
[`llms.txt`](https://coss-sv.vercel.app/llms.txt),
[`llms-full.txt`](https://coss-sv.vercel.app/llms-full.txt), and the Markdown form of every docs page.

## Repository layout

```text
apps/ui/                    SvelteKit documentation and registry host
packages/ui/                Svelte component package source
packages/typescript-config/ shared TypeScript settings
skills/coss-svelte/         installable coding-agent skill
docs/porting/               component evidence and parity records
docs/operations/            release and deployment policy
scripts/                    registry, parity, policy, and verification tooling
```

`reference/` and `shardsui/` are local comparison inputs. They are ignored by Git and never
published.

## Develop locally

Requirements:

- Node.js 22.18 through 24
- pnpm 10.22.0

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

The full local gate is:

```bash
pnpm verify
pnpm test
pnpm build
pnpm test:e2e
pnpm --filter @coss-sv/ui pack:check
pnpm --filter @coss-sv/docs registry:smoke
pnpm test:docs:e2e
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for source inspection, testing, browser comparison, and review
requirements. Release and deployment responsibilities are recorded in
[docs/operations/release.md](docs/operations/release.md); browser resource limits are documented in
[docs/operations/browser-tests.md](docs/operations/browser-tests.md).

## Provenance and license

The port adapts only the MIT-designated `reference/apps/ui/**` subtree of COSS pinned by this
repository. COSS and its contributors retain their rights in the original work. This project is not
endorsed by COSS.

The Svelte port was made by [Miel](https://github.com/mielsense) and is distributed under the MIT
License. Read [NOTICE.md](NOTICE.md), [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), and
[LICENSE](LICENSE) before redistributing it.
