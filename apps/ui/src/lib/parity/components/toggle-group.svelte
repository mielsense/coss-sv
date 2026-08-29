<script lang="ts">
  import { ToggleGroup } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";
</script>

<div class="toggle-group-fixture">
  <section data-particle="p-toggle-group-1">
    <ToggleGroup.Root defaultValue={["bold"]}>
      <ToggleGroup.Item aria-label="Toggle bold" value="bold">{@render boldIcon()}</ToggleGroup.Item
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
      <ToggleGroup.Item aria-label="Toggle bold" value="bold">{@render boldIcon()}</ToggleGroup.Item
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
      <ToggleGroup.Item aria-label="Toggle bold" value="bold">{@render boldIcon()}</ToggleGroup.Item
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
      <ToggleGroup.Item aria-label="Toggle bold" value="bold">{@render boldIcon()}</ToggleGroup.Item
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
      <ToggleGroup.Item aria-label="Toggle bold" value="bold">{@render boldIcon()}</ToggleGroup.Item
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
      <ToggleGroup.Item aria-label="Toggle bold" value="bold">{@render boldIcon()}</ToggleGroup.Item
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
      <ToggleGroup.Item aria-label="Toggle bold" value="bold">{@render boldIcon()}</ToggleGroup.Item
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
      <ToggleGroup.Item aria-label="Toggle bold" value="bold">{@render boldIcon()}</ToggleGroup.Item
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
  <FixtureIcon aria-hidden="true" name="bold" />
{/snippet}

{#snippet italicIcon()}
  <FixtureIcon aria-hidden="true" name="italic" />
{/snippet}

{#snippet underlineIcon()}
  <FixtureIcon aria-hidden="true" name="underline" />
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
