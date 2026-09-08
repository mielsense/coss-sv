<script lang="ts">
  import * as Select from "./index.js";
  let value = $state<string | null>();
  let open = $state<boolean>();
  const items = [
    { label: "First", value: "first" },
    { label: "Second", value: "second" },
  ];
</script>

<button onclick={() => (value = "second")}>Set second</button>
<button onclick={() => (open = true)}>Open select</button>
<button onclick={() => (value = null)}>Clear selection</button>
<Select.Root bind:value bind:open {items}>
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
