<script lang="ts">
import * as Tabs from "./index.js";
</script>

<Tabs.Root aria-label="Account" value="overview">
  <Tabs.List size="sm">
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab disabled value="projects">Projects</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel keepMounted value="projects">Projects content</Tabs.Panel>
</Tabs.Root>
