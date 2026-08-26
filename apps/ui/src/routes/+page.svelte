<script lang="ts">
import { authorUrl, repositoryUrl } from "$lib/site/site.js";
</script>

<svelte:head>
  <title>COSS for Svelte</title>
  <meta
    name="description"
    content="An unofficial Svelte 5 port of the COSS component library, built on Shards UI."
  >
</svelte:head>

<section class="hero">
  <p class="eyebrow">Svelte 5 component library</p>
  <h1>COSS for Svelte</h1>
  <p class="hero-copy">
    A Svelte 5 port of the COSS component library, built on Shards UI and designed to preserve COSS
    styling, behavior, and accessibility.
  </p>
  <p class="hero-credit">Unofficial Svelte port made by <a href={authorUrl}>Miel</a>.</p>
  <div class="hero-actions">
    <a class="site-button" data-primary="true" href="/docs/introduction">Read the documentation</a>
    <a class="site-button" href={repositoryUrl}>View the source</a>
  </div>
</section>
