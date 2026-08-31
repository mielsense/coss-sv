<script lang="ts">
  import type { TabsChangeEventDetails, TabsValue } from "./index.js";
  import * as Tabs from "./index.js";

  let cancelValue = $state<TabsValue>();
  let cancelChange = $state("unset");
  let automaticChanges = $state<string[]>([]);
  let disableSecond = $state(false);
  let showSecond = $state(true);
  let nullChanges = $state(0);

  const objectOne = { id: 1 };
  const objectTwo = { id: 2 };
  let objectValue = $state.raw(objectOne);

  function describeChange(value: TabsValue, details: TabsChangeEventDetails): string {
    return [
      String(value),
      details.reason,
      details.activationDirection,
      details.event.type,
      String(details.trigger?.textContent ?? "none"),
      String(details.isCanceled),
    ].join(":");
  }
</script>

<Tabs.Root
  bind:value={cancelValue}
  defaultValue="cancel-one"
  onValueChange={(next, details) => {
    details.cancel();
    cancelChange = describeChange(next, details);
  }}
>
  <Tabs.List aria-label="Cancelable tabs">
    <Tabs.Tab value="cancel-one">Cancel one</Tabs.Tab>
    <Tabs.Tab value="cancel-two">Cancel two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="cancel-one">Cancel panel one</Tabs.Panel>
  <Tabs.Panel value="cancel-two">Cancel panel two</Tabs.Panel>
</Tabs.Root>

<output data-testid="cancel-value">{cancelValue ?? "unset"}</output>
<output data-testid="cancel-details">{cancelChange}</output>

<Tabs.Root
  onValueChange={(next, details) => {
    if (details.reason !== "none") details.cancel();
    automaticChanges.push(describeChange(next, details));
  }}
>
  <Tabs.List aria-label="Automatic tabs">
    <Tabs.Tab value="automatic-one">Automatic one</Tabs.Tab>
    {#if showSecond}
      <Tabs.Tab disabled={disableSecond} value="automatic-two">Automatic two</Tabs.Tab>
    {/if}
    <Tabs.Tab value="automatic-three">Automatic three</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="automatic-one">Automatic panel one</Tabs.Panel>
  {#if showSecond}
    <Tabs.Panel value="automatic-two">Automatic panel two</Tabs.Panel>
  {/if}
  <Tabs.Panel value="automatic-three">Automatic panel three</Tabs.Panel>
</Tabs.Root>

<button data-testid="disable-second" onclick={() => (disableSecond = !disableSecond)} type="button">
  Toggle second disabled
</button>
<button data-testid="remove-second" onclick={() => (showSecond = false)} type="button">
  Remove second
</button>
<output data-testid="automatic-changes">{automaticChanges.join("|")}</output>

<Tabs.Root defaultValue={null} onValueChange={() => (nullChanges += 1)}>
  <Tabs.List aria-label="Null default tabs">
    <Tabs.Tab value="null-one">Null one</Tabs.Tab>
    <Tabs.Tab value="null-two">Null two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="null-one">Null panel one</Tabs.Panel>
  <Tabs.Panel value="null-two">Null panel two</Tabs.Panel>
</Tabs.Root>
<output data-testid="null-changes">{nullChanges}</output>

<Tabs.Root bind:value={objectValue}>
  <Tabs.List aria-label="Object tabs">
    <Tabs.Tab value={objectOne}>Object one</Tabs.Tab>
    <Tabs.Tab value={objectTwo}>Object two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value={objectOne}>Object panel one</Tabs.Panel>
  <Tabs.Panel value={objectTwo}>Object panel two</Tabs.Panel>
</Tabs.Root>
