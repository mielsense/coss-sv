<script lang="ts">
import * as Sheet from "./index.js";
import type { SheetSide } from "./index.js";
let open = $state(false);
let side = $state<SheetSide>("right");
function show(next: SheetSide) {
  side = next;
  open = true;
}
</script>
{#each ["right", "left", "top", "bottom"] as item}
  <button type="button" onclick={() => show(item as SheetSide)}>Open {item}</button>
{/each}
<Sheet.Root bind:open
  ><Sheet.Popup {side} variant="inset" data-testid="sheet-popup"
    ><Sheet.Header
      ><Sheet.Title>{side} sheet</Sheet.Title
      ><Sheet.Description>Sheet content.</Sheet.Description></Sheet.Header
    ><Sheet.Panel><button type="button">Inside</button></Sheet.Panel
    ><Sheet.Footer><Sheet.Close>Close sheet</Sheet.Close></Sheet.Footer></Sheet.Popup
  ></Sheet.Root
>
<output data-testid="sheet-state">{open}:{side}</output>
<style>
:global([data-slot="sheet-backdrop"]),
:global([data-slot="sheet-viewport"]) {
  z-index: 50;
}
</style>
