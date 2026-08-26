<script lang="ts">
import { page } from "$app/state";
import { getPreview } from "./preview-registry.js";

const name = $derived(page.params.name ?? "");
const theme = $derived(page.url.searchParams.get("theme") === "dark" ? "dark" : "light");
const Preview = $derived(getPreview(name));
</script>

<svelte:head>
  <title>{name} preview</title>
</svelte:head>

<div
  class={["preview-frame", { dark: theme === "dark" }]}
  data-preview-name={name}
  data-preview-theme={theme}
  style={`color-scheme: ${theme}`}
>
  {#if Preview}
    <div data-preview-ready="true" data-preview-found="true">
      <Preview />
    </div>
  {:else}
    <section class="missing-preview" data-preview-ready="true" data-preview-missing="true">
      <h1>Preview not found</h1>
      <p>No particle is registered as <code>{name}</code>.</p>
    </section>
  {/if}
</div>

<style>
.preview-frame {
  display: grid;
  width: 100%;
  min-height: calc(100vh - 4rem);
  place-items: center;
  background: var(--background);
  color: var(--foreground);
}

.preview-frame > div {
  width: 100%;
}

.missing-preview {
  max-width: 32rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.missing-preview h1,
.missing-preview p {
  margin: 0;
}

.missing-preview p {
  margin-top: 0.5rem;
}
</style>
