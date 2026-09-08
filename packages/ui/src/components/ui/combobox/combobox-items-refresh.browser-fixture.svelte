<script lang="ts">
  import { Combobox as Shards } from "@shardsui/svelte/combobox";
  import * as C from "./index.js";

  let { primitive = false }: { primitive?: boolean } = $props();
  let open = $state(false);
  let closeCount = $state(0);
  function onOpenChangeComplete(next: boolean) {
    if (!next) closeCount += 1;
  }
  const selected = { value: "apple", label: "Apple" };
  let items = $state.raw([selected]);
</script>

<button
  type="button"
  data-testid="refresh-items"
  onclick={() => {
    selected.label = "Renamed apple";
    items = [selected];
  }}>Refresh items</button
>
<button type="button" data-testid="close" onclick={() => (open = false)}>Close</button>
<button type="button" data-testid="reopen" onclick={() => (open = true)}>Reopen</button>
<output data-testid="close-count">{closeCount}</output>
{#if primitive}
  <Shards.Root {items} value={selected} bind:open {onOpenChangeComplete}
    ><Shards.Input aria-label="Items input" /><Shards.Popup /></Shards.Root
  >
{:else}
  <C.Root {items} value={selected} bind:open {onOpenChangeComplete}
    ><C.Input aria-label="Items input" /><Shards.Popup /></C.Root
  >
{/if}
