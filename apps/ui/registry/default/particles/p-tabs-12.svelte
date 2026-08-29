<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["badge", "tabs"],
    id: "p-tabs-12",
    interactive: true,
    responsive: false,
    title: "Tabs with icon only and count badge",
  });
</script>

<script lang="ts">
  import { Badge, HugeiconsIcon, Tabs } from "@coss-sv/ui";
  import { House01Icon, InboxIcon, Settings01Icon } from "@hugeicons/core-free-icons";
</script>

<Tabs.Root class="items-center" defaultValue="tab-1">
  <Tabs.List>
    <Tabs.Tab aria-label="Overview" class="size-10!" value="tab-1">
      <HugeiconsIcon aria-hidden="true" icon={House01Icon} strokeWidth={2} />
    </Tabs.Tab>
    <Tabs.Tab aria-label="Inbox" class="size-10!" value="tab-2">
      <HugeiconsIcon aria-hidden="true" icon={InboxIcon} strokeWidth={2} />
      <Badge class="absolute end-0 top-0 rounded-full not-in-data-active:opacity-64" size="sm"
        >5</Badge
      >
    </Tabs.Tab>
    <Tabs.Tab aria-label="Settings" class="size-10!" value="tab-3">
      <HugeiconsIcon aria-hidden="true" icon={Settings01Icon} strokeWidth={2} />
    </Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab-1">
    <p class="p-4 text-center text-muted-foreground text-xs">Overview content</p>
  </Tabs.Panel>
  <Tabs.Panel value="tab-2">
    <p class="p-4 text-center text-muted-foreground text-xs">Inbox content</p>
  </Tabs.Panel>
  <Tabs.Panel value="tab-3">
    <p class="p-4 text-center text-muted-foreground text-xs">Settings content</p>
  </Tabs.Panel>
</Tabs.Root>
