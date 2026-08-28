<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["tabs"],
  id: "p-tabs-9",
  interactive: true,
  responsive: false,
  title: "Tabs with underline and icon on top",
});
</script>

<script lang="ts">
import { Tabs } from "@coss-sv/ui";
import { BoxIcon, House01Icon, PanelsTopLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Tabs.Root class="items-center" defaultValue="tab-1">
  <div class="border-b">
    <Tabs.List variant="underline">
      <Tabs.Tab class="h-auto! flex-col gap-1.5 py-[calc(--spacing(2)-1px)]" value="tab-1">
        <HugeiconsIcon
          aria-hidden="true"
          class="size-4 opacity-60"
          icon={House01Icon}
          strokeWidth={2}
        />
        Overview
      </Tabs.Tab>
      <Tabs.Tab class="h-auto! flex-col gap-1.5 py-[calc(--spacing(2)-1px)]" value="tab-2">
        <HugeiconsIcon
          aria-hidden="true"
          class="size-4 opacity-60"
          icon={PanelsTopLeftIcon}
          strokeWidth={2}
        />
        Projects
      </Tabs.Tab>
      <Tabs.Tab class="h-auto! flex-col gap-1.5 py-[calc(--spacing(2.5)-1px)]" value="tab-3">
        <HugeiconsIcon
          aria-hidden="true"
          class="size-4 opacity-60"
          icon={BoxIcon}
          strokeWidth={2}
        />
        Packages
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
    <p class="p-4 text-center text-muted-foreground text-xs">Packages content</p>
  </Tabs.Panel>
</Tabs.Root>
