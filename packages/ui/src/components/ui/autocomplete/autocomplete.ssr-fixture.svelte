<script lang="ts">
  import * as Autocomplete from "./index.js";

  const items = ["Apple", "Banana"];
</script>

{#snippet searchAddon()}
  <span data-testid="autocomplete-addon">Search</span>
{/snippet}

<Autocomplete.Root {items} value="Apple"
  ><Autocomplete.Input
    aria-label="Fruit"
    showClear
    showTrigger
    size="sm"
    startAddon={searchAddon}
  /></Autocomplete.Root
>

<Autocomplete.Root {items} value="Apple">
  <Autocomplete.Trigger data-testid="bare-autocomplete-trigger" />
</Autocomplete.Root>
