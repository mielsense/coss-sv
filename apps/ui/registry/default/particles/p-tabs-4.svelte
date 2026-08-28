<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({ components: ["tabs"], containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-80", id: "p-tabs-4", interactive: true, responsive: true, title: "Vertical tabs with underline" });
</script>
<script lang="ts">import { Tabs } from "@coss-sv/ui";</script>

<Tabs.Root class="w-full flex-row" defaultValue="tab-1" orientation="vertical">
  <div class="border-s"><Tabs.List variant="underline">
    <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab><Tabs.Tab value="tab-2">Tab 2</Tabs.Tab><Tabs.Tab value="tab-3">Tab 3</Tabs.Tab>
  </Tabs.List></div>
  <Tabs.Panel value="tab-1"><p class="p-4 text-center text-muted-foreground text-xs">Tab 1 content</p></Tabs.Panel>
  <Tabs.Panel value="tab-2"><p class="p-4 text-center text-muted-foreground text-xs">Tab 2 content</p></Tabs.Panel>
  <Tabs.Panel value="tab-3"><p class="p-4 text-center text-muted-foreground text-xs">Tab 3 content</p></Tabs.Panel>
</Tabs.Root>
