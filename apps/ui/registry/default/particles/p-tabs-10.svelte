<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["badge", "tabs"],
  id: "p-tabs-10",
  interactive: true,
  responsive: false,
  title: "Tabs with count badge",
});
</script>
<script lang="ts">
import { Badge, Tabs } from "@coss-sv/ui";
</script>

<Tabs.Root defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Tab value="tab-1"
      >All
      <Badge class="not-in-data-active:text-muted-foreground" variant="outline"
        >128</Badge
      ></Tabs.Tab
    >
    <Tabs.Tab value="tab-2"
      >Pending
      <Badge class="not-in-data-active:text-muted-foreground" variant="outline">8</Badge></Tabs.Tab
    >
    <Tabs.Tab value="tab-3"
      >Completed
      <Badge class="not-in-data-active:text-muted-foreground" variant="outline"
        >120</Badge
      ></Tabs.Tab
    >
  </Tabs.List>
  <Tabs.Panel value="tab-1"
    ><p class="p-4 text-center text-muted-foreground text-xs">All items content</p></Tabs.Panel
  >
  <Tabs.Panel value="tab-2"
    ><p class="p-4 text-center text-muted-foreground text-xs">Pending items content</p></Tabs.Panel
  >
  <Tabs.Panel value="tab-3"
    ><p class="p-4 text-center text-muted-foreground text-xs">
      Completed items content
    </p></Tabs.Panel
  >
</Tabs.Root>
