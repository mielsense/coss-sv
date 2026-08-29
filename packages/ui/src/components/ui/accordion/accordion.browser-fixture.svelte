<script lang="ts">
  import * as Accordion from "./index.js";

  let singleValue = $state<string[]>(["one"]);
  let multipleValue = $state<string[]>([]);
  let changes = $state<string[][]>([]);
  let deferredValue = $state<string[] | undefined>();
</script>

<Accordion.Root
  aria-label="Single accordion"
  bind:value={singleValue}
  data-testid="single-root"
  onValueChange={(value) => changes.push(value)}
>
  <Accordion.Item value="one">
    <Accordion.Header>
      <Accordion.Trigger>Single one</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel data-testid="single-one">Single answer one</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item disabled value="two">
    <Accordion.Header>
      <Accordion.Trigger>Single two</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>Single answer two</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="three">
    <Accordion.Header>
      <Accordion.Trigger>Single three</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>Single answer three</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>

<Accordion.Root aria-label="Multiple accordion" bind:value={multipleValue} multiple>
  <Accordion.Item value="alpha">
    <Accordion.Header><Accordion.Trigger>Multiple alpha</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Multiple answer alpha</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="beta">
    <Accordion.Header><Accordion.Trigger>Multiple beta</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Multiple answer beta</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>

<Accordion.Root aria-label="Deferred accordion" bind:value={deferredValue}>
  <Accordion.Item value="deferred">
    <Accordion.Header><Accordion.Trigger>Deferred item</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Deferred answer</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>

<output data-testid="single-value">{singleValue.join(",")}</output>
<output data-testid="multiple-value">{multipleValue.join(",")}</output>
<output data-testid="changes">{changes.map((value) => value.join("+")).join(",")}</output>
<output data-testid="deferred-value">{deferredValue?.join(",") ?? "unset"}</output>
