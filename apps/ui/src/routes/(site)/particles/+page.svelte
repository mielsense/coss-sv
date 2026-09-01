<script lang="ts">
  import { page } from "$app/state";
  import ParticleCard from "@/particles/ParticleCard.svelte";
  import ParticleSearchField from "@/particles/ParticleSearchField.svelte";
  import { particleCatalog } from "@/particles/catalog.js";
  import { filterParticles, getParticleSearchItems, parseParticleTags } from "@/particles/model.js";
  import type { Component } from "svelte";
  import { getParticlePreview } from "@/registry/particle-previews.js";
  import { getParticleSource } from "@/registry/particle-sources.js";

  const availableParticles = particleCatalog;
  const searchItems = getParticleSearchItems(availableParticles);
  const parsedTags = $derived(parseParticleTags(page.url.searchParams.get("tags")));
  const selectedItems = $derived(
    parsedTags.valid
      .map((tag) => searchItems.find(({ value }) => value === tag))
      .filter((item) => item !== undefined),
  );
  const filteredParticles = $derived(filterParticles(availableParticles, parsedTags.valid));
  const shouldShowEmpty = $derived(
    parsedTags.invalid.length > 0 ||
      (parsedTags.valid.length > 0 && filteredParticles.length === 0),
  );
  const description = `Discover ${availableParticles.length} ready-to-use particles, the building blocks of your design system. Filter by category to find the perfect component for your project.`;

  async function loadParticleComponent(name: string): Promise<Component> {
    const entry = await getParticlePreview(name);
    if (!entry) throw new Error(`Particle preview ${name} is unavailable.`);
    return entry.component;
  }
</script>

<svelte:head>
  <title>Browse Particles - COSS for Svelte</title>
  <meta name="description" content={description} />
</svelte:head>

<div class="site-container w-full">
  <header class="py-12 sm:py-16 lg:py-20">
    <h1 class="font-heading font-semibold text-4xl tracking-tight sm:text-5xl">Browse Particles</h1>
    <p class="mt-4 max-w-2xl text-muted-foreground text-lg">{description}</p>
  </header>

  <div class="mb-8 md:mb-12 lg:mb-16">
    <ParticleSearchField items={searchItems} particles={availableParticles} {selectedItems} />
  </div>

  {#if shouldShowEmpty}
    <div class="text-center">
      <p class="text-muted-foreground">No particles found for the selected filters</p>
    </div>
  {:else if parsedTags.valid.length > 0}
    <div
      class="grid flex-1 items-stretch gap-9 pb-12 lg:grid-cols-2 lg:gap-6 xl:gap-9"
      data-particle-grid
    >
      {#each filteredParticles as particle (particle.name)}
        <ParticleCard
          loadComponent={() => loadParticleComponent(particle.name)}
          loadSource={() => getParticleSource(particle.name)}
          {particle}
        />
      {/each}
    </div>
  {/if}
</div>
