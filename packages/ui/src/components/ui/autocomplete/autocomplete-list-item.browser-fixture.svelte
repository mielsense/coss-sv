<script lang="ts">
  import * as Autocomplete from "./index.js";

  let { staticContent = false }: { staticContent?: boolean } = $props();
  const items = [
    { label: "Apple", value: "apple" },
    { label: "Orange", value: "orange" },
  ];
  let list = $state<HTMLElement | null>(null);
</script>

<Autocomplete.Root {items} inline open>
  <Autocomplete.Input aria-label="Search fruit" />
  {#if staticContent}
    <Autocomplete.List>
      {#snippet children(state)}
        <output data-testid="empty-state">{String(state.empty)}</output>
        <Autocomplete.Collection>
          {#snippet children(fruit: (typeof items)[number])}
            <Autocomplete.Item value={fruit}>{fruit.label}</Autocomplete.Item>
          {/snippet}
        </Autocomplete.Collection>
      {/snippet}
    </Autocomplete.List>
  {:else}
    <Autocomplete.List bind:ref={list} aria-label="Fruit results" data-testid="fruit-results">
      {#snippet item(fruit: (typeof items)[number], index: number)}
        <Autocomplete.Item value={fruit}>{fruit.label} ({index})</Autocomplete.Item>
      {/snippet}
    </Autocomplete.List>
  {/if}
</Autocomplete.Root>
<output data-testid="list-ref">{list?.getAttribute("aria-label") ?? "none"}</output>
