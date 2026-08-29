<script lang="ts">
  import * as Accordion from "./index.js";

  let { defaultValue = ["one"] }: { defaultValue?: string[] } = $props();
</script>

<Accordion.Root {defaultValue}>
  <Accordion.Item value="one">
    <Accordion.Header><Accordion.Trigger>Default one</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Default answer one</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="two">
    <Accordion.Header><Accordion.Trigger>Default two</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Default answer two</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
