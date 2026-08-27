<script lang="ts">
import type { TabsValue } from "@shardsui/svelte";
import * as Tabs from "./index.js";

let { defaultValue = "one" }: { defaultValue?: TabsValue } = $props();
</script>

<Tabs.Root {defaultValue}>
  <Tabs.List>
    <Tabs.Tab value="one">Default tab one</Tabs.Tab>
    <Tabs.Tab value="two">Default tab two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="one">Default panel one</Tabs.Panel>
  <Tabs.Panel value="two">Default panel two</Tabs.Panel>
</Tabs.Root>
