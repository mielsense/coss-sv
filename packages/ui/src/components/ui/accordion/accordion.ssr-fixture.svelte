<script lang="ts">
import * as Accordion from "./index.js";
</script>

<Accordion.Root aria-label="Questions" value={["one"]}>
  <Accordion.Item value="one">
    <Accordion.Header as="h2">
      <Accordion.Trigger>Question one</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>Answer one</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item disabled value="two">
    <Accordion.Header>
      <Accordion.Trigger>Question two</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel keepMounted>Answer two</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
