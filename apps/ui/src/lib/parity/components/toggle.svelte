<script lang="ts">
  import { Toggle } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";

  let bookmarked = $state(false);
</script>

<div class="toggle-fixture">
  <section data-particle="p-toggle-1">
    <Toggle>Toggle</Toggle>
  </section>

  <section data-particle="p-toggle-2">
    <Toggle variant="outline">Outline Toggle</Toggle>
  </section>

  <section data-particle="p-toggle-3">
    <Toggle aria-label="Toggle bold" variant="outline">{@render boldIcon()}</Toggle>
  </section>

  <section data-particle="p-toggle-4">
    <Toggle size="sm" variant="outline">Small</Toggle>
  </section>

  <section data-particle="p-toggle-5">
    <Toggle size="lg" variant="outline">Large</Toggle>
  </section>

  <section data-particle="p-toggle-6">
    <Toggle disabled variant="outline">Disabled</Toggle>
  </section>

  <section data-particle="p-toggle-7">
    <div class="flex items-center gap-1">
      <Toggle aria-label="Toggle bold" variant="outline">{@render boldIcon()}</Toggle>
      <Toggle aria-label="Toggle italic" variant="outline">{@render italicIcon()}</Toggle>
      <Toggle aria-label="Toggle underline" variant="outline">{@render underlineIcon()}</Toggle>
    </div>
  </section>

  <section data-review-probes="toggle">
    <Toggle
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this"}
      bind:pressed={bookmarked}
      data-testid="controlled-bookmark"
    >
      {@render bookmarkIcon()}
    </Toggle>
    <output data-testid="bookmark-state">{bookmarked ? "bookmarked" : "not bookmarked"}</output>
  </section>
</div>

{#snippet boldIcon()}
  <FixtureIcon aria-hidden="true" name="bold" />
{/snippet}

{#snippet italicIcon()}
  <FixtureIcon aria-hidden="true" name="italic" />
{/snippet}

{#snippet underlineIcon()}
  <FixtureIcon aria-hidden="true" name="underline" />
{/snippet}

{#snippet bookmarkIcon()}
  <FixtureIcon aria-hidden="true" name="bookmark" />
{/snippet}

<style>
  .toggle-fixture {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    align-items: center;
    justify-items: center;
    gap: 2rem;
    padding: 2rem;
  }

  .toggle-fixture section {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: center;
  }

  [data-review-probes="toggle"] {
    flex-direction: column;
    gap: 0.5rem;
  }

  [data-review-probes="toggle"] output {
    font-size: 0.75rem;
  }

  @media (max-width: 639px) {
    .toggle-fixture {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem 1rem;
      padding: 1.5rem;
    }
  }
</style>
