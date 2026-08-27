<script lang="ts">
import { ToggleGroup } from "@coss-sv/ui";
</script>

<div class="toggle-group-fixture">
  <section data-particle="p-toggle-group-1">
    <ToggleGroup.Root defaultValue={["bold"]}>
      <ToggleGroup.Item aria-label="Toggle bold" value="bold"
        >{@render boldIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle italic" value="italic"
        >{@render italicIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle underline" value="underline"
        >{@render underlineIcon()}</ToggleGroup.Item
      >
    </ToggleGroup.Root>
  </section>

  <section data-particle="p-toggle-group-2">
    <ToggleGroup.Root defaultValue={["bold"]} size="sm">
      <ToggleGroup.Item aria-label="Toggle bold" value="bold"
        >{@render boldIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle italic" value="italic"
        >{@render italicIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle underline" value="underline"
        >{@render underlineIcon()}</ToggleGroup.Item
      >
    </ToggleGroup.Root>
  </section>

  <section data-particle="p-toggle-group-3">
    <ToggleGroup.Root defaultValue={["bold"]} size="lg">
      <ToggleGroup.Item aria-label="Toggle bold" value="bold"
        >{@render boldIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle italic" value="italic"
        >{@render italicIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle underline" value="underline"
        >{@render underlineIcon()}</ToggleGroup.Item
      >
    </ToggleGroup.Root>
  </section>

  <section data-particle="p-toggle-group-4">
    <ToggleGroup.Root defaultValue={["bold"]} variant="outline">
      <ToggleGroup.Item aria-label="Toggle bold" value="bold"
        >{@render boldIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Separator />
      <ToggleGroup.Item aria-label="Toggle italic" value="italic"
        >{@render italicIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Separator />
      <ToggleGroup.Item aria-label="Toggle underline" value="underline"
        >{@render underlineIcon()}</ToggleGroup.Item
      >
    </ToggleGroup.Root>
  </section>

  <section data-particle="p-toggle-group-5">
    <ToggleGroup.Root defaultValue={["bold"]} orientation="vertical" variant="outline">
      <ToggleGroup.Item aria-label="Toggle bold" value="bold"
        >{@render boldIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Separator orientation="horizontal" />
      <ToggleGroup.Item aria-label="Toggle italic" value="italic"
        >{@render italicIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Separator orientation="horizontal" />
      <ToggleGroup.Item aria-label="Toggle underline" value="underline"
        >{@render underlineIcon()}</ToggleGroup.Item
      >
    </ToggleGroup.Root>
  </section>

  <section data-particle="p-toggle-group-6">
    <ToggleGroup.Root defaultValue={["bold"]} disabled>
      <ToggleGroup.Item aria-label="Toggle bold" value="bold"
        >{@render boldIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle italic" value="italic"
        >{@render italicIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle underline" value="underline"
        >{@render underlineIcon()}</ToggleGroup.Item
      >
    </ToggleGroup.Root>
  </section>

  <section data-particle="p-toggle-group-7">
    <ToggleGroup.Root defaultValue={["bold"]}>
      <ToggleGroup.Item aria-label="Toggle bold" value="bold"
        >{@render boldIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle italic" disabled value="italic"
        >{@render italicIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle underline" value="underline"
        >{@render underlineIcon()}</ToggleGroup.Item
      >
    </ToggleGroup.Root>
  </section>

  <section data-particle="p-toggle-group-8">
    <ToggleGroup.Root defaultValue={["bold"]} multiple>
      <ToggleGroup.Item aria-label="Toggle bold" value="bold"
        >{@render boldIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle italic" value="italic"
        >{@render italicIcon()}</ToggleGroup.Item
      >
      <ToggleGroup.Item aria-label="Toggle underline" value="underline"
        >{@render underlineIcon()}</ToggleGroup.Item
      >
    </ToggleGroup.Root>
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

<style>
.toggle-group-fixture {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: center;
  justify-items: center;
  gap: 2rem;
  padding: 2rem;
}

.toggle-group-fixture section {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
}

@media (max-width: 639px) {
  .toggle-group-fixture {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem 1rem;
    padding: 1.5rem;
  }
}
</style>
