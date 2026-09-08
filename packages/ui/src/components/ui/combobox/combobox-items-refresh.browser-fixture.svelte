<script lang="ts">
  import { Combobox as Shards } from "@shardsui/svelte/combobox";
  import * as C from "./index.js";

  let {
    primitive = false,
    cancelComposition = false,
  }: { primitive?: boolean; cancelComposition?: boolean } = $props();
  let compositionCount = $state(0);
  let isOpen = $state(false);
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
<button type="button" data-testid="close" onclick={() => (isOpen = false)}>Close</button>
<button type="button" data-testid="reopen" onclick={() => (isOpen = true)}>Reopen</button>
<output data-testid="composition-count">{compositionCount}</output>
<output data-testid="close-count">{closeCount}</output>
{#if primitive}
  <Shards.Root {items} value={selected} bind:open={isOpen} {onOpenChangeComplete}
    ><Shards.Input aria-label="Items input" /><Shards.Popup /></Shards.Root
  >
{:else}
  <C.Root
    {items}
    value={selected}
    bind:open={isOpen}
    {onOpenChangeComplete}
    onInputValueChange={(_, details) => {
      if (cancelComposition && details.event.type === "compositionend") details.cancel();
    }}
    ><C.Input
      aria-label="Items input"
      oncompositionend={() => (compositionCount += 1)}
    /><Shards.Popup /></C.Root
  >
{/if}
