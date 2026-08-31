<script lang="ts">
  import * as Select from "./index.js";

  const items = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
  ];
  let value = $state("next");
  let reason = $state("");
  let eventType = $state("");
  let triggerTag = $state("");

  function preventVite(next: string | null, details: Select.SelectChangeEventDetails): void {
    reason = details.reason;
    eventType = details.event?.type ?? "";
    triggerTag = details.trigger?.tagName ?? "";
    if (next === "vite") details.cancel();
  }
</script>

<Select.Root bind:value {items} onValueChange={preventVite}>
  <Select.Trigger aria-label="Cancelable framework"><Select.Value /></Select.Trigger>
  <Select.Popup>
    {#each items as item (item.value)}
      <Select.Item value={item.value}>{item.label}</Select.Item>
    {/each}
  </Select.Popup>
</Select.Root>
<output data-testid="cancelable-value">{value}</output>
<output data-testid="change-reason">{reason}</output>
<output data-testid="change-event">{eventType}</output>
<output data-testid="change-trigger">{triggerTag}</output>

<Select.Root defaultValue="vite" {items}>
  <Select.Trigger aria-label="Default framework"><Select.Value /></Select.Trigger>
</Select.Root>
