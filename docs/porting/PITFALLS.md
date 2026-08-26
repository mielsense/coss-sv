# Porting pitfalls

## Source provenance

**Symptom:** an agent finds a convenient component copy under `reference/packages/ui`.

**Cause:** the React package tree is generated from the registry but falls under the repository's default license boundary.

**Safe pattern:** read and adapt only `reference/apps/ui/registry/default/**` and related content under `reference/apps/ui/**`.

## Svelte generation mixing

**Symptom:** a new component combines `$props()` with `on:`, slots, `export let`, or `createEventDispatcher`.

**Cause:** React-to-Svelte conversion fell back to legacy Svelte syntax.

**Safe pattern:** keep the entire component in current Svelte 5 runes mode with snippets and callback props.

## Shards hidden content and motion

**Symptom:** a Svelte transition never runs on a Shards part controlled with `hidden`.

**Cause:** the browser removes the visual state before a Svelte transition can own it.

**Safe pattern:** use Shards starting and ending state attributes plus the reference CSS. Add JavaScript motion only when a named upstream behavior cannot be matched with those mechanisms.

## Documentation brand leakage

**Symptom:** component previews become orange even though the COSS reference is neutral.

**Cause:** the docs `--site-primary` token replaced the installable component `--primary` token.

**Safe pattern:** scope `#ff3e00` to documentation chrome and reset preview canvases to package tokens.

## Shared-file collisions

**Symptom:** parallel lanes overwrite exports, registry metadata, or lockfile changes.

**Cause:** an implementation agent edited a coordinator-owned aggregate file.

**Safe pattern:** lanes edit only assigned component, fixture, test, and evidence paths. They request aggregate changes in their handoff.

## Unpublished Shards source version

**Symptom:** the local Shards package declares `0.1.0-beta.1`, while npm resolves only `0.1.0-beta.0`.

**Cause:** the local tagged source is ahead of the public registry.

**Safe pattern:** use the local beta.1 checkout as the inspection authority, pin the installable dependency to beta.0, and run a compatibility test for every wrapped export. Upgrade the dependency when beta.1 is publicly resolvable; never link the uncommitted local checkout into published output.
