<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["tabs"],
  id: "p-tabs-6",
  interactive: true,
  responsive: false,
  title: "Tabs with icon before name",
});
</script>

<script lang="ts">
import { Tabs } from "@coss-sv/ui";
import { House01Icon, PanelsTopLeftIcon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Tabs.Root defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Tab value="tab-1">
      <HugeiconsIcon aria-hidden="true" icon={House01Icon} strokeWidth={2} />
      Overview
    </Tabs.Tab>
    <Tabs.Tab value="tab-2">
      <HugeiconsIcon aria-hidden="true" icon={PanelsTopLeftIcon} strokeWidth={2} />
      Projects
    </Tabs.Tab>
    <Tabs.Tab value="tab-3">
      <HugeiconsIcon aria-hidden="true" icon={Settings01Icon} strokeWidth={2} />
      Settings
    </Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab-1">
    <p class="p-4 text-center text-muted-foreground text-xs">Overview content</p>
  </Tabs.Panel>
  <Tabs.Panel value="tab-2">
    <p class="p-4 text-center text-muted-foreground text-xs">Projects content</p>
  </Tabs.Panel>
  <Tabs.Panel value="tab-3">
    <p class="p-4 text-center text-muted-foreground text-xs">Settings content</p>
  </Tabs.Panel>
</Tabs.Root>
