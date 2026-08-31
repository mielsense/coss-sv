<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["tabs"],
    id: "p-tabs-1",
    interactive: true,
    responsive: true,
    title: "Segmented tabs",
  });
</script>

<script lang="ts">
  import { Tabs } from "@coss-sv/ui";
</script>

<Tabs.Root defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab><Tabs.Tab value="tab-2">Tab 2</Tabs.Tab><Tabs.Tab
      value="tab-3"
    >
      Tab 3
    </Tabs.Tab>
  </Tabs.List><Tabs.Panel value="tab-1">
    <p class="p-4 text-center text-muted-foreground text-xs">Tab 1 content</p>
  </Tabs.Panel><Tabs.Panel value="tab-2">
    <p class="p-4 text-center text-muted-foreground text-xs">Tab 2 content</p>
  </Tabs.Panel><Tabs.Panel value="tab-3">
    <p class="p-4 text-center text-muted-foreground text-xs">Tab 3 content</p>
  </Tabs.Panel>
</Tabs.Root>
