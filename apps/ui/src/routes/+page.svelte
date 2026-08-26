<script lang="ts">
import CategoryThumbnail from "$lib/site/CategoryThumbnail.svelte";
import { componentCategories } from "$lib/site/categories.js";
</script>

<svelte:head>
  <title>A new, modern UI component library built on top of Shards UI - COSS for Svelte</title>
  <meta
    name="description"
    content="COSS for Svelte is a modern Svelte 5 component library built on top of Shards UI."
  >
</svelte:head>

<section class="hero-section">
  <div class="site-container">
    <div class="hero">
      <h1>A new, modern UI component library built on top of Shards UI.</h1>
      <p class="hero-copy">Built for developers and AI.</p>
      <div class="hero-actions">
        <a class="site-button" data-primary="true" href="/docs/introduction">Get started</a>
        <a class="site-button" href="/particles">Browse 508 particles</a>
      </div>
    </div>
  </div>
</section>

<section class="categories-section" aria-label="Components">
  <div class="frame-markers" aria-hidden="true"></div>
  <div class="site-container">
    <div class="category-grid">
      {#each componentCategories as category (category.slug)}
        <article class="category-card" data-category={category.slug}>
          <div class="category-card-header">
            <h2><a href={`/docs/components/${category.slug}`}>{category.name}</a></h2>
            <p>{category.description}</p>
          </div>
          <div class="category-preview">
            {#if category.isNew}
              <span class="new-badge">New</span>
            {/if}
            <CategoryThumbnail slug={category.slug} />
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
