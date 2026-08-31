<script lang="ts">
  import CategoryThumbnail from "@/site/CategoryThumbnail.svelte";
  import { componentCategories } from "@/site/categories.js";
  import NewBadge from "@/site/NewBadge.svelte";

  const siteButtonClass =
    "relative inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-[0.625rem] border border-site-border bg-site-panel px-3.25 font-medium no-underline shadow-[0_1px_2px_rgb(0_0_0/4%)] hover:bg-[color-mix(in_srgb,var(--site-panel)_50%,var(--site-foreground)_4%)] focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3 active:shadow-[0_1px_0_rgb(0_0_0/8%)_inset] sm:min-h-9 sm:text-sm";
</script>

<svelte:head>
  <title>A new, modern UI component library built on top of Shards UI - COSS for Svelte</title>
  <meta
    name="description"
    content="COSS for Svelte is a modern Svelte 5 component library built on top of Shards UI."
  />
</svelte:head>

<section data-home-hero>
  <div class="site-container">
    <div
      class="flex max-w-2xl flex-col items-start gap-2 py-8 text-left md:py-12 lg:py-16 min-[80rem]:gap-4"
    >
      <h1 class="m-0 font-heading text-4xl leading-10 font-bold lg:text-5xl lg:leading-12">
        A new, modern UI component library built on top of Shards UI.
      </h1>
      <p class="m-0 text-site-muted leading-6 lg:text-lg lg:leading-7" data-home-copy>
        Built for developers and AI.
      </p>
      <div class="mt-2 flex gap-2" data-home-actions>
        <a
          class={[
            siteButtonClass,
            "border-site-primary bg-site-primary text-site-primary-foreground shadow-[0_1px_0_rgb(255_255_255/16%)_inset,0_1px_2px_color-mix(in_srgb,var(--site-primary)_24%,transparent)] hover:bg-site-primary/90",
          ]}
          href="/docs">Get started</a
        >
        <a class={siteButtonClass} href="/particles">Browse 508 particles</a>
      </div>
    </div>
  </div>
</section>

<section
  class="relative before:absolute before:inset-x-0 before:top-0 before:z-1 before:h-px before:bg-site-border-soft"
  aria-label="Components"
>
  <div class="frame-markers" aria-hidden="true"></div>
  <div class="site-container">
    <div
      class="grid gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 min-[80rem]:grid-cols-4"
      data-category-grid
    >
      {#each componentCategories as category (category.slug)}
        <article
          class="group relative flex min-w-0 flex-col rounded-2xl border border-site-border bg-site-card shadow-[0_0_0_4px_var(--site-background),0_0_0_5px_var(--site-border-soft),0_1px_2px_rgb(0_0_0/3%)] sm:h-79"
          data-category={category.slug}
        >
          <div class="grid grid-rows-[auto_1fr] px-6 py-4 sm:min-h-24">
            <h2
              class="m-0 self-center font-heading text-base leading-6 font-bold [font-variation-settings:'GEOM'_50,'opsz'_32]"
            >
              <a
                class="no-underline before:absolute before:inset-0 before:z-2 before:rounded-[inherit] focus-visible:before:outline-2 focus-visible:before:outline-site-primary focus-visible:before:outline-offset-3"
                href={`/docs/components/${category.slug}`}>{category.name}</a
              >
            </h2>
            <p
              class="m-0 line-clamp-2 max-h-10 overflow-hidden text-site-muted text-sm leading-5 sm:h-10"
            >
              {category.description}
            </p>
          </div>
          <div
            class="relative -m-px flex h-55 min-h-55 w-[calc(100%+2px)] flex-none items-center justify-center overflow-x-auto rounded-[0.875rem_0.875rem_1rem_1rem] border-site-border border-t bg-[var(--site-preview)] [--border:rgb(0_0_0/7%)] [--btn-from:color-mix(in_srgb,var(--primary)_90%,transparent)] [--btn-to:var(--primary)] dark:[--border:rgb(255_255_255/3%)] dark:[--btn-from:var(--primary)] dark:[--btn-to:color-mix(in_srgb,var(--primary)_90%,transparent)]"
          >
            {#if category.isNew}
              <NewBadge class="absolute top-3 right-3 z-1" />
            {/if}
            <CategoryThumbnail slug={category.slug} />
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
