<script lang="ts">
import { Toggle } from "@coss-sv/ui";

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
    <Toggle aria-label="Toggle bold" variant="outline"> {@render boldIcon()} </Toggle>
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
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
  </svg>
{/snippet}

{#snippet italicIcon()}
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <line x1="19" x2="10" y1="4" y2="4" />
    <line x1="14" x2="5" y1="20" y2="20" />
    <line x1="15" x2="9" y1="4" y2="20" />
  </svg>
{/snippet}

{#snippet underlineIcon()}
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    <line x1="4" x2="20" y1="20" y2="20" />
  </svg>
{/snippet}

{#snippet bookmarkIcon()}
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
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
