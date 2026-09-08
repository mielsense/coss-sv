<script lang="ts">
  import * as Combobox from "./index.js";

  let { mode = "input" }: { mode?: "input" | "chips" | "popup" | "custom" } = $props();
  let custom = $state<HTMLDivElement | null>(null);
  const items = ["Apple", "Orange"];
</script>

<div
  bind:this={custom}
  data-testid="custom-anchor"
  style="width: 310px; height: 24px; margin: 40px"
>
  Custom anchor
</div>
<div style="width: 256px; margin: 40px">
  <Combobox.Root {items} multiple={mode === "chips"}>
    {#if mode === "chips"}
      <Combobox.Chips data-testid="anchor" style="display: block; width: 256px; height: 32px">
        <Combobox.ChipsInput aria-label="Choose" style="width: 120px; height: 30px" />
      </Combobox.Chips>
    {:else if mode === "popup"}
      <Combobox.Trigger data-testid="anchor" style="width: 256px; height: 32px">
        Choose
      </Combobox.Trigger>
    {:else}
      <Combobox.Input aria-label="Choose" data-testid="anchor" showTrigger={false} />
    {/if}
    <Combobox.Popup anchor={mode === "custom" ? custom : undefined}>
      {#if mode === "popup"}<Combobox.Input aria-label="Search" showTrigger={false} />{/if}
      <Combobox.List>
        {#snippet item(item: string)}<Combobox.Item value={item}>{item}</Combobox.Item>{/snippet}
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
</div>

<style>
  :global([data-slot="combobox-input-group"]) {
    width: 256px;
  }
  :global([data-slot="input-control"]) {
    display: block;
    border: 1px solid;
  }
  :global([data-slot="combobox-input"]) {
    box-sizing: border-box;
    width: 254px;
    height: 30px;
  }
</style>
