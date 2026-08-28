<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["tabs"],
  containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-80",
  id: "p-tabs-11",
  interactive: true,
  responsive: true,
  title: "Vertical tabs with underline and icon before name",
});
</script>

<script lang="ts">
import { Tabs } from "@coss-sv/ui";
import { House01Icon, PanelsTopLeftIcon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Tabs.Root class="w-full flex-row" defaultValue="tab-1" orientation="vertical">
  <div class="border-s">
    <Tabs.List variant="underline">
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
  </div>
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
