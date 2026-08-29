<script lang="ts">
  import * as Tabs from "./index.js";

  let value = $state<Tabs.TabsValue>("one");
  let changes = $state<Tabs.TabsValue[]>([]);
  let deferredValue = $state<Tabs.TabsValue | undefined>();
</script>

<Tabs.Root bind:value data-testid="controlled-root" onValueChange={(next) => changes.push(next)}>
  <Tabs.List aria-label="Primary tabs" data-testid="controlled-list">
    <Tabs.Tab value="one">One</Tabs.Tab>
    <Tabs.Tab disabled value="two">Two</Tabs.Tab>
    <Tabs.Tab value="three">Three</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel data-testid="panel-one" value="one">Panel one</Tabs.Panel>
  <Tabs.Panel data-testid="panel-two" keepMounted value="two">Panel two</Tabs.Panel>
  <Tabs.Panel data-testid="panel-three" value="three">Panel three</Tabs.Panel>
</Tabs.Root>

<Tabs.Root bind:value={deferredValue} defaultValue="deferred-one">
  <Tabs.List aria-label="Deferred tabs">
    <Tabs.Tab value="deferred-one">Deferred one</Tabs.Tab>
    <Tabs.Tab value="deferred-two">Deferred two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="deferred-one">Deferred panel one</Tabs.Panel>
  <Tabs.Panel value="deferred-two">Deferred panel two</Tabs.Panel>
</Tabs.Root>

<Tabs.Root defaultValue="vertical-one" orientation="vertical">
  <Tabs.List activateOnFocus aria-label="Vertical tabs" variant="underline">
    <Tabs.Tab value="vertical-one">Vertical one</Tabs.Tab>
    <Tabs.Tab value="vertical-two">Vertical two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="vertical-one">Vertical panel one</Tabs.Panel>
  <Tabs.Panel value="vertical-two">Vertical panel two</Tabs.Panel>
</Tabs.Root>

<output data-testid="value">{value}</output>
<output data-testid="changes">{changes.join(",")}</output>
<output data-testid="deferred-value">{deferredValue ?? "unset"}</output>
