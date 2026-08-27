<script lang="ts">
import { page } from "$app/state";
import { parsePreviewQuery } from "./preview-contract.js";
import { getPreview } from "./preview-registry.js";

const name = $derived(page.params.name ?? "");
const query = $derived(parsePreviewQuery(page.url.searchParams));
const Preview = $derived(query.ok ? getPreview(name) : undefined);

function documentTheme(theme: "dark" | "light") {
  return (_node: HTMLElement) => {
    const root = document.documentElement;
    const previousTheme = root.dataset.previewTheme;
    const previousColorScheme = root.style.colorScheme;
    const previouslyDark = root.classList.contains("dark");
    const previouslyLight = root.classList.contains("light");

    root.dataset.previewTheme = theme;
    root.style.colorScheme = theme;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");

    return () => {
      if (previousTheme) root.dataset.previewTheme = previousTheme;
      else delete root.dataset.previewTheme;
      root.style.colorScheme = previousColorScheme;
      root.classList.toggle("dark", previouslyDark);
      root.classList.toggle("light", previouslyLight);
    };
  };
}
</script>

<svelte:head>
  <title>{name} preview</title>
</svelte:head>

<div
  class={["preview-frame", { dark: query.ok && query.theme === "dark" }]}
  {@attach documentTheme(query.ok ? query.theme : "light")}
  data-preview-name={name}
  data-preview-theme={query.ok ? query.theme : undefined}
  style:color-scheme={query.ok ? query.theme : "light"}
>
  {#if !query.ok}
    <section class="invalid-preview" data-preview-invalid="true">
      <h1>Invalid preview configuration</h1>
      <ul>
        {#each query.errors as error (error)}
          <li>{error}</li>
        {/each}
      </ul>
    </section>
  {:else}
    <div
      class="preview-surface"
      data-preview-ready="true"
      data-preview-found={Preview ? "true" : undefined}
      data-preview-missing={Preview ? undefined : "true"}
      data-preview-width={query.width}
      data-preview-width-px={query.widthPixels}
      style:--preview-width={`${query.widthPixels}px`}
    >
      {#if Preview}
        <Preview />
      {:else}
        <section class="missing-preview">
          <h1>Preview not found</h1>
          <p>No particle is registered as <code>{name}</code>.</p>
        </section>
      {/if}
    </div>
  {/if}
</div>

<style>
.preview-frame {
  position: fixed;
  inset: 0;
  display: grid;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  place-items: center;
  background: var(--background);
  color: var(--foreground);
}

.preview-surface {
  width: min(100%, var(--preview-width));
  min-height: 24rem;
  background: var(--background);
}

.invalid-preview,
.missing-preview {
  box-sizing: border-box;
  width: min(100%, 32rem);
  margin-inline: auto;
  max-width: 32rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.invalid-preview h1,
.invalid-preview ul,
.missing-preview h1,
.missing-preview p {
  margin: 0;
}

.invalid-preview ul,
.missing-preview p {
  margin-top: 0.5rem;
}
</style>
