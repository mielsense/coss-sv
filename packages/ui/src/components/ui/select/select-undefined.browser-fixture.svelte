<script lang="ts">
  import * as Select from "./index.js";
  let value = $state<string | null>();
  let isOpen = $state<boolean>();
  const items = [
    { label: "First", value: "first" },
    { label: "Second", value: "second" },
  ];
</script>

<button type="button" onclick={() => (value = "second")}>Set second</button>
<button type="button" onclick={() => (isOpen = true)}>Open select</button>
<button type="button" onclick={() => (value = null)}>Clear selection</button>
<Select.Root bind:value bind:open={isOpen} {items}>
  <Select.Trigger aria-label="Initially undefined"
    ><Select.Value placeholder="Empty" /></Select.Trigger
  >
  <Select.Popup>
    {#each items as item (item.value)}
      <Select.Item value={item.value}>{item.label}</Select.Item>
    {/each}
  </Select.Popup>
</Select.Root>
<output data-testid="value">{value}</output>
