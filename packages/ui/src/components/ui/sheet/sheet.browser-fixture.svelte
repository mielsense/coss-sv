<script lang="ts">
import * as Sheet from "./index.js";
import type { SheetSide } from "./index.js";
import Input from "../input/input.svelte";
let open = $state(false);
let side = $state<SheetSide>("right");
let values = $state(["Margaret Welsh", "@maggie.welsh", "Margaret Welsh", "@maggie.welsh"]);
const detached = Sheet.createHandle<{ label: string }>();
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
    ><Sheet.Panel
      >{#each values as value, index}
        <Input aria-label={`Sheet seed ${index + 1}`} bind:value={values[index]} />
      {/each}
      <button type="button">Inside</button></Sheet.Panel
    ><Sheet.Footer><Sheet.Close>Close sheet</Sheet.Close></Sheet.Footer></Sheet.Popup
  ></Sheet.Root
>
<output data-testid="sheet-state">{open}:{side}</output>
<Sheet.Trigger handle={detached} payload={{ label: "Detached sheet payload" }}>
  Open detached sheet
</Sheet.Trigger>
<Sheet.Root handle={detached}>
  {#snippet children({ payload })}
    <Sheet.Popup>
      <Sheet.Title>Detached sheet</Sheet.Title>
      <Sheet.Description>{payload?.label}</Sheet.Description>
      <Sheet.Close>Close detached sheet</Sheet.Close>
    </Sheet.Popup>
  {/snippet}
</Sheet.Root>
<style>
:global([data-slot="sheet-backdrop"]),
:global([data-slot="sheet-viewport"]) {
  z-index: 50;
}
</style>
