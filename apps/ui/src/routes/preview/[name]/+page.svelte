<script lang="ts">
import { page } from "$app/state";
import type { PageProps } from "./$types";
import { setPreviewRuntimeContext } from "./preview-context.js";
import { parsePreviewQuery } from "./preview-contract.js";
import { installPreviewEnvironment } from "./preview-environment.js";
import { getParticleLinks, getPreview } from "./preview-registry.js";
import { createPreviewRuntime } from "./preview-runtime.js";

let { data }: PageProps = $props();

const name = $derived(data.name);
const query = $derived(parsePreviewQuery(page.url.searchParams));
const entry = $derived(getPreview(name));
const Preview = $derived(entry?.component);
const metadata = $derived(entry?.kind === "particle" ? entry.meta : undefined);
const links = $derived(metadata ? getParticleLinks(metadata.id) : undefined);
const runtime = $derived(query.ok ? createPreviewRuntime(query) : undefined);

setPreviewRuntimeContext({
  get current() {
    if (!runtime) throw new Error("Preview runtime is unavailable for an invalid configuration");
    return runtime;
  },
});
</script>

<svelte:head>
  <title>{name} preview</title>
</svelte:head>

{#if !query.ok}
  <div class="preview-frame" data-preview-frame="true" data-preview-name={name}>
    <section class="invalid-preview" data-preview-invalid="true">
      <h1>Invalid preview configuration</h1>
      <ul>
        {#each query.errors as error (error)}
          <li>{error}</li>
        {/each}
      </ul>
    </section>
  </div>
{:else}
  <div
    class={["preview-frame", { dark: query.theme === "dark" }]}
    {@attach installPreviewEnvironment(query)}
    data-preview-align={query.align}
    data-preview-direction={query.direction}
    data-preview-frame="true"
    data-preview-locale={query.locale}
    data-preview-name={name}
    data-preview-network={query.network}
    data-preview-now={query.now}
    data-preview-reduced-motion={query.reducedMotion}
    data-preview-seed={query.seed}
    data-preview-theme={query.theme}
    data-preview-timers={query.timers}
    style:color-scheme={query.theme}
  >
    <div
      class={["preview-surface", metadata?.containerClass]}
      dir={query.direction}
      lang={query.locale}
      data-preview-align={query.align}
      data-preview-found="true"
      data-preview-install-command={links?.installCommand}
      data-preview-kind={entry?.kind}
      data-preview-ready="true"
      data-preview-registry-href={links?.registryHref}
      data-preview-source-href={links?.sourceHref}
      data-preview-width={query.width}
      data-preview-width-px={query.widthPixels}
      style:--preview-height={metadata?.iframeHeight ? `${metadata.iframeHeight}px` : undefined}
      style:--preview-width={`${query.widthPixels}px`}
    >
      <div data-slot="preview">
        {#if Preview}
          <Preview />
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
.preview-frame {
  position: fixed;
  inset: 0;
  box-sizing: border-box;
  display: flex;
  min-width: 0;
  min-height: 0;
  justify-content: center;
  overflow-y: auto;
  padding: 2.5rem;
  background: var(--background);
  color: var(--foreground);
}

.preview-frame[data-preview-align="start"] {
  align-items: flex-start;
}

.preview-frame[data-preview-align="center"] {
  align-items: center;
}

.preview-frame[data-preview-align="end"] {
  align-items: flex-end;
}

.preview-surface {
  flex: 0 0 auto;
  width: min(100%, var(--preview-width));
  min-height: var(--preview-height, auto);
  background: var(--background);
}

@media (max-width: 40rem) {
  .preview-frame {
    padding-inline: 1.5rem;
  }
}

.invalid-preview {
  box-sizing: border-box;
  width: min(100%, 32rem);
  max-width: 32rem;
  margin: auto;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.invalid-preview h1,
.invalid-preview ul {
  margin: 0;
}

.invalid-preview ul {
  margin-top: 0.5rem;
}
</style>
