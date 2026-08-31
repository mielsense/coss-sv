<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["tabs"],
    id: "p-tabs-7",
    interactive: true,
    responsive: false,
    title: "Tabs with icon before name and underline",
  });
</script>

<script lang="ts">
  import { HugeiconsIcon, Tabs } from "@coss-sv/ui";
  import House01Icon from "@hugeicons/core-free-icons/House01Icon";
  import PanelsTopLeftIcon from "@hugeicons/core-free-icons/PanelsTopLeftIcon";
  import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
</script>

<Tabs.Root defaultValue="tab-1">
  <div class="border-b">
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
